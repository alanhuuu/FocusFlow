"""
Music Discovery - Find NEW songs based on learned focus patterns
Uses MusicBrainz for search + AcousticBrainz for audio features
"""
import requests
import time
import numpy as np
from typing import Optional
from ml.live_training import train_model_from_mongodb, FEATURE_COLS


# MusicBrainz API
MUSICBRAINZ_API = "https://musicbrainz.org/ws/2"
ACOUSTICBRAINZ_API = "https://acousticbrainz.org/api/v1"

HEADERS = {
    "User-Agent": "FocusFlow/1.0 (focus-music-app)"
}


def get_focus_profile(min_entries: int = 3) -> Optional[dict]:
    """
    Train model and extract the ideal focus profile.
    Returns average audio features of songs where user was focused.
    """
    from services.mongodb_service import get_responses_for_training

    responses = get_responses_for_training()
    if len(responses) < min_entries:
        return None

    # Get songs where user was focused (low TBR)
    tbr_values = [r.get("tbr_average", 999) for r in responses]
    threshold = np.quantile(tbr_values, 0.35)  # Bottom 35% TBR = focused

    focused_songs = [r for r in responses if r.get("tbr_average", 999) <= threshold]

    if not focused_songs:
        return None

    # Calculate average audio features of focused songs
    profile = {}
    feature_keys = ["tempo", "energy", "danceability", "valence", "acousticness",
                    "instrumentalness", "speechiness", "liveness"]

    for key in feature_keys:
        values = []
        for song in focused_songs:
            audio = song.get("audio_features", {})
            if key in audio and audio[key] is not None:
                values.append(float(audio[key]))
        if values:
            profile[key] = round(np.mean(values), 3)

    # Get most common genre
    genres = [s.get("audio_features", {}).get("genre") for s in focused_songs]
    genres = [g for g in genres if g]
    if genres:
        profile["genre"] = max(set(genres), key=genres.count)

    print(f"Focus profile from {len(focused_songs)} focused songs: {profile}")
    return profile


def search_musicbrainz_by_tag(tag: str, limit: int = 50) -> list:
    """
    Search MusicBrainz for recordings with a specific tag/genre.
    Returns list of {mbid, title, artist}
    """
    url = f"{MUSICBRAINZ_API}/recording"
    params = {
        "query": f"tag:{tag}",
        "limit": limit,
        "fmt": "json"
    }

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for rec in data.get("recordings", []):
            mbid = rec.get("id")
            title = rec.get("title")
            artists = rec.get("artist-credit", [])
            artist = artists[0].get("name") if artists else "Unknown"

            if mbid and title:
                results.append({
                    "mbid": mbid,
                    "title": title,
                    "artist": artist
                })

        print(f"Found {len(results)} songs for tag '{tag}'")
        return results

    except Exception as e:
        print(f"MusicBrainz search error: {e}")
        return []


def search_musicbrainz_similar(artist: str, limit: int = 30) -> list:
    """
    Search MusicBrainz for recordings by similar artists.
    """
    url = f"{MUSICBRAINZ_API}/recording"
    params = {
        "query": f"artist:{artist}",
        "limit": limit,
        "fmt": "json"
    }

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for rec in data.get("recordings", []):
            mbid = rec.get("id")
            title = rec.get("title")
            artists = rec.get("artist-credit", [])
            artist_name = artists[0].get("name") if artists else "Unknown"

            if mbid and title:
                results.append({
                    "mbid": mbid,
                    "title": title,
                    "artist": artist_name
                })

        return results

    except Exception as e:
        print(f"MusicBrainz search error: {e}")
        return []


def get_acousticbrainz_features(mbid: str) -> Optional[dict]:
    """
    Get audio features from AcousticBrainz for a specific MBID.
    """
    try:
        # High-level features
        hl_url = f"{ACOUSTICBRAINZ_API}/{mbid}/high-level"
        hl_resp = requests.get(hl_url, timeout=5)

        if hl_resp.status_code != 200:
            return None

        hl_data = hl_resp.json()
        hl = hl_data.get("highlevel", {})

        # Low-level features
        ll_url = f"{ACOUSTICBRAINZ_API}/{mbid}/low-level"
        ll_resp = requests.get(ll_url, timeout=5)
        ll_data = ll_resp.json() if ll_resp.status_code == 200 else {}
        ll = ll_data.get("lowlevel", {})
        rhythm = ll_data.get("rhythm", {})
        tonal = ll_data.get("tonal", {})

        features = {
            "mbid": mbid,
            "source": "acousticbrainz",
            "danceability": hl.get("danceability", {}).get("all", {}).get("danceable", 0),
            "energy": hl.get("mood_aggressive", {}).get("all", {}).get("aggressive", 0),
            "valence": hl.get("mood_happy", {}).get("all", {}).get("happy", 0),
            "acousticness": hl.get("mood_acoustic", {}).get("all", {}).get("acoustic", 0),
            "instrumentalness": hl.get("voice_instrumental", {}).get("all", {}).get("instrumental", 0),
            "speechiness": 1 - hl.get("voice_instrumental", {}).get("all", {}).get("instrumental", 0),
            "tempo": rhythm.get("bpm", 120),
            "liveness": hl.get("mood_party", {}).get("all", {}).get("party", 0),
            "genre": hl.get("genre_rosamerica", {}).get("value", "unknown"),
        }

        return features

    except Exception as e:
        return None


def discover_new_music(min_entries: int = 3, top_k: int = 3) -> Optional[list]:
    """
    Main function: Discover NEW music based on learned focus patterns.

    1. Train model and get focus profile
    2. Search MusicBrainz for songs matching profile
    3. Get AcousticBrainz features for each
    4. Score with trained model
    5. Return top recommendations (excluding already listened songs)
    """
    from services.mongodb_service import get_responses_for_training

    # Step 1: Train model
    result = train_model_from_mongodb(min_entries=min_entries)
    if result is None:
        print("Not enough training data")
        return None

    model, feature_cols, threshold = result

    # Get focus profile
    profile = get_focus_profile(min_entries=min_entries)
    if not profile:
        print("Could not extract focus profile")
        return None

    # Get songs user already listened to (to exclude)
    existing_songs = get_responses_for_training()
    listened_titles = set()
    for s in existing_songs:
        title = s.get("song_name", "").lower()
        if title:
            listened_titles.add(title)

    # Step 2: Search MusicBrainz
    candidates = []

    # Search by genre if available
    if profile.get("genre"):
        genre_results = search_musicbrainz_by_tag(profile["genre"], limit=50)
        candidates.extend(genre_results)
        time.sleep(1)  # Rate limiting

    # Also search for instrumental/chill if high instrumentalness
    if profile.get("instrumentalness", 0) > 0.5:
        inst_results = search_musicbrainz_by_tag("instrumental", limit=30)
        candidates.extend(inst_results)
        time.sleep(1)

    # Search for chill/ambient if low energy
    if profile.get("energy", 1) < 0.3:
        chill_results = search_musicbrainz_by_tag("chill", limit=30)
        candidates.extend(chill_results)
        time.sleep(1)

    if not candidates:
        # Fallback: search for electronic music
        candidates = search_musicbrainz_by_tag("electronic", limit=50)

    print(f"Found {len(candidates)} candidate songs from MusicBrainz")

    # Remove duplicates and already listened
    seen_mbids = set()
    unique_candidates = []
    for c in candidates:
        mbid = c["mbid"]
        title = c["title"].lower()
        if mbid not in seen_mbids and title not in listened_titles:
            seen_mbids.add(mbid)
            unique_candidates.append(c)

    print(f"After filtering: {len(unique_candidates)} unique new songs")

    # Step 3 & 4: Get features and score
    scored_songs = []

    for candidate in unique_candidates[:30]:  # Limit API calls
        mbid = candidate["mbid"]
        features = get_acousticbrainz_features(mbid)

        if not features:
            continue

        # Build feature vector for model
        feature_vector = []
        for col in feature_cols:
            if col == "tbr_mean":
                feature_vector.append(0)  # Unknown for new songs
            elif col == "tbr_std":
                feature_vector.append(0)
            elif col == "loudness":
                feature_vector.append(0)
            else:
                feature_vector.append(float(features.get(col, 0)))

        # Score with model
        X = np.array([feature_vector], dtype=float)
        prob = model.predict_proba(X)[0][1]  # Probability of focus

        scored_songs.append({
            "mbid": mbid,
            "song_name": candidate["title"],
            "artist_name": candidate["artist"],
            "focus_score": round(float(prob), 3),
            "audio_features": features
        })

        time.sleep(0.2)  # Rate limiting for AcousticBrainz

    # Step 5: Sort and return top K
    scored_songs.sort(key=lambda x: x["focus_score"], reverse=True)
    recommendations = scored_songs[:top_k]

    print(f"Returning {len(recommendations)} new music recommendations")
    for rec in recommendations:
        print(f"  - {rec['song_name']} by {rec['artist_name']} ({rec['focus_score']*100:.0f}%)")

    return recommendations
