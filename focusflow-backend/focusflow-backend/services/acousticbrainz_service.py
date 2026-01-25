"""
Audio Features Service - Fetches audio features for songs

Note: AcousticBrainz was shut down in 2022. This service uses MusicBrainz
for metadata lookup and can be extended to compute features locally
or use alternative APIs.
"""
import requests
import hashlib
from typing import Optional

MUSICBRAINZ_API = "https://musicbrainz.org/ws/2"
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


def get_audio_features(song_id: str, song_name: str, artist_name: str) -> dict:
    """
    Get audio features for a song.

    Currently returns estimated features based on available metadata.
    In production, you could:
    - Use Spotify API (if available)
    - Compute features locally with Essentia/Librosa
    - Use a pre-computed features database

    Returns dict with:
    - tempo (BPM)
    - energy (0-1)
    - danceability (0-1)
    - instrumentalness (0-1)
    - valence/mood (0-1, 0=sad, 1=happy)
    - acousticness (0-1)
    """
    # Check cache first
    cache_key = f"{song_id}:{song_name}:{artist_name}"
    if cache_key in _features_cache:
        return _features_cache[cache_key]

    # Try to get MusicBrainz ID for potential future lookups
    mbid = get_musicbrainz_id(song_name, artist_name)

    # Generate consistent pseudo-features based on song info
    # This ensures same song always gets same features
    # In production, replace with real audio analysis
    hash_input = f"{song_name.lower()}{artist_name.lower()}"
    hash_bytes = hashlib.md5(hash_input.encode()).digest()

    features = {
        "source": "estimated",  # Mark as estimated, not real
        "mbid": mbid,
        "tempo": 60 + (hash_bytes[0] % 120),  # 60-180 BPM
        "energy": round((hash_bytes[1] % 100) / 100, 2),
        "danceability": round((hash_bytes[2] % 100) / 100, 2),
        "instrumentalness": round((hash_bytes[3] % 100) / 100, 2),
        "valence": round((hash_bytes[4] % 100) / 100, 2),  # mood
        "acousticness": round((hash_bytes[5] % 100) / 100, 2),
        "speechiness": round((hash_bytes[6] % 100) / 100, 2),
        "liveness": round((hash_bytes[7] % 100) / 100, 2),
    }

    # Cache the result
    _features_cache[cache_key] = features

    print(f"Generated audio features for: {song_name} (tempo: {features['tempo']} BPM)")

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
