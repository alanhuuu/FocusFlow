"""
Audio Features Service - Fetches audio features for songs using AcousticBrainz
"""
import requests
import hashlib
from typing import Optional

MUSICBRAINZ_API = "https://musicbrainz.org/ws/2"
ACOUSTICBRAINZ_API = "https://acousticbrainz.org/api/v1"
USER_AGENT = "FocusFlow/1.0 (hackathon project)"

# Cache for audio features (in production, store in MongoDB)
_features_cache = {}


def get_musicbrainz_id(song_name: str, artist_name: str) -> Optional[str]:
    """
    Search MusicBrainz for a song and return its MBID
    """
    try:
        query = f'recording:"{song_name}" AND artist:"{artist_name}"'
        url = f"{MUSICBRAINZ_API}/recording"

        response = requests.get(
            url,
            params={"query": query, "limit": 1, "fmt": "json"},
            headers={"User-Agent": USER_AGENT},
            timeout=10
        )

        if response.ok:
            data = response.json()
            recordings = data.get("recordings", [])
            if recordings:
                return recordings[0].get("id")

    except Exception as e:
        print(f"MusicBrainz lookup failed: {e}")

    return None


def get_acousticbrainz_features(mbid: str) -> Optional[dict]:
    """
    Fetch audio features from AcousticBrainz using MusicBrainz ID
    """
    if not mbid:
        return None

    try:
        # Try high-level features first (has mood, genre, etc.)
        high_level_url = f"{ACOUSTICBRAINZ_API}/{mbid}/high-level"
        low_level_url = f"{ACOUSTICBRAINZ_API}/{mbid}/low-level"

        high_resp = requests.get(
            high_level_url,
            headers={"User-Agent": USER_AGENT},
            timeout=10
        )

        low_resp = requests.get(
            low_level_url,
            headers={"User-Agent": USER_AGENT},
            timeout=10
        )

        features = {}

        # Parse high-level features
        if high_resp.ok:
            high_data = high_resp.json()
            hl = high_data.get("highlevel", {})

            # Mood/valence
            mood_happy = hl.get("mood_happy", {}).get("all", {}).get("happy", 0)
            features["valence"] = round(mood_happy, 2)

            # Danceability
            danceability = hl.get("danceability", {}).get("all", {}).get("danceable", 0)
            features["danceability"] = round(danceability, 2)

            # Acousticness
            acoustic = hl.get("mood_acoustic", {}).get("all", {}).get("acoustic", 0)
            features["acousticness"] = round(acoustic, 2)

            # Instrumentalness (voice vs instrumental)
            instrumental = hl.get("voice_instrumental", {}).get("all", {}).get("instrumental", 0)
            features["instrumentalness"] = round(instrumental, 2)

            # Mood - relaxed vs aggressive (important for focus)
            mood_relaxed = hl.get("mood_relaxed", {}).get("all", {}).get("relaxed", 0)
            mood_aggressive = hl.get("mood_aggressive", {}).get("all", {}).get("aggressive", 0)
            features["mood_relaxed"] = round(mood_relaxed, 2)
            features["mood_aggressive"] = round(mood_aggressive, 2)
            features["energy"] = round(mood_aggressive, 2)  # Keep energy as alias

            # Genre (top prediction)
            genre_data = hl.get("genre_dortmund", {}).get("all", {})
            if genre_data:
                top_genre = max(genre_data, key=genre_data.get, default="unknown")
                features["genre"] = top_genre

        # Parse low-level features
        if low_resp.ok:
            low_data = low_resp.json()
            rhythm = low_data.get("rhythm", {})
            tonal = low_data.get("tonal", {})

            # Tempo/BPM
            bpm = rhythm.get("bpm", 0)
            features["tempo"] = round(bpm) if bpm else 120

            # Key and scale (major/minor)
            features["key"] = tonal.get("key_key", "unknown")
            features["scale"] = tonal.get("key_scale", "unknown")

            # Additional low-level
            features["speechiness"] = round(low_data.get("lowlevel", {}).get("spectral_centroid", {}).get("mean", 0) / 5000, 2)
            features["liveness"] = round(low_data.get("lowlevel", {}).get("dynamic_complexity", 0) / 10, 2)

        if features:
            features["source"] = "acousticbrainz"
            features["mbid"] = mbid
            print(f"Got AcousticBrainz features for MBID: {mbid}")
            return features

    except Exception as e:
        print(f"AcousticBrainz lookup failed: {e}")

    return None


def generate_estimated_features(song_name: str, artist_name: str, mbid: str = None) -> dict:
    """
    Generate consistent pseudo-features based on song info as fallback
    """
    hash_input = f"{song_name.lower()}{artist_name.lower()}"
    hash_bytes = hashlib.md5(hash_input.encode()).digest()

    return {
        "source": "estimated",
        "mbid": mbid,
        "tempo": 60 + (hash_bytes[0] % 120),  # 60-180 BPM
        "energy": round((hash_bytes[1] % 100) / 100, 2),
        "danceability": round((hash_bytes[2] % 100) / 100, 2),
        "instrumentalness": round((hash_bytes[3] % 100) / 100, 2),
        "valence": round((hash_bytes[4] % 100) / 100, 2),
        "acousticness": round((hash_bytes[5] % 100) / 100, 2),
        "speechiness": round((hash_bytes[6] % 100) / 100, 2),
        "liveness": round((hash_bytes[7] % 100) / 100, 2),
    }


def get_audio_features(song_id: str, song_name: str, artist_name: str) -> dict:
    """
    Get audio features for a song.

    1. First tries AcousticBrainz (if MBID found)
    2. Falls back to estimated features

    Returns dict with:
    - tempo (BPM)
    - energy (0-1)
    - danceability (0-1)
    - instrumentalness (0-1)
    - valence/mood (0-1, 0=sad, 1=happy)
    - acousticness (0-1)
    """
    # Check cache first - only use cached if it's real AcousticBrainz data
    cache_key = f"{song_id}:{song_name}:{artist_name}"
    if cache_key in _features_cache:
        cached = _features_cache[cache_key]
        if cached.get("source") == "acousticbrainz":
            return cached
        # Don't use cached estimated data - try fresh lookup

    # Try to get MusicBrainz ID
    mbid = get_musicbrainz_id(song_name, artist_name)

    # Try AcousticBrainz first
    features = None
    if mbid:
        features = get_acousticbrainz_features(mbid)

    # Fall back to estimated features
    if not features:
        features = generate_estimated_features(song_name, artist_name, mbid)
        print(f"Using estimated features for: {song_name} (no AcousticBrainz data)")
    else:
        print(f"Got real AcousticBrainz features for: {song_name}")
        # Only cache real AcousticBrainz data
        _features_cache[cache_key] = features

    return features


def get_features_for_training(responses: list) -> list:
    """
    Enrich a list of song responses with audio features
    Returns list ready for ML training
    """
    enriched = []

    for response in responses:
        features = get_audio_features(
            response.get("song_id", ""),
            response.get("song_name", ""),
            response.get("artist_name", "")
        )

        # Combine EEG data with audio features
        training_row = {
            # Target variable
            "action": response["action"],
            "tbr_average": response["tbr_average"],

            # Audio features (input variables)
            "tempo": features["tempo"],
            "energy": features["energy"],
            "danceability": features["danceability"],
            "instrumentalness": features["instrumentalness"],
            "valence": features["valence"],
            "acousticness": features["acousticness"],

            # Metadata
            "song_id": response["song_id"],
            "song_name": response["song_name"],
        }

        enriched.append(training_row)

    return enriched
