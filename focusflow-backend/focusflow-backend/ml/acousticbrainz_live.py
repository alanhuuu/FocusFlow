import requests
import time

MB_BASE = "https://musicbrainz.org/ws/2"
AB_BASE = "https://acousticbrainz.org"  # may vary by endpoint availability

HEADERS = {
    "User-Agent": "FocusFlowHackathon/1.0 (hamza@focusflow)"
}

def search_musicbrainz_recordings(query: str, limit: int = 50):
    """
    Returns a list of recording MBIDs from MusicBrainz search.
    """
    url = f"{MB_BASE}/recording/"
    params = {
        "query": query,
        "fmt": "json",
        "limit": limit
    }

    r = requests.get(url, params=params, headers=HEADERS, timeout=15)
    r.raise_for_status()

    data = r.json()
    recordings = data.get("recordings", [])

    mbids = []
    for rec in recordings:
        mbid = rec.get("id")
        title = rec.get("title", "Unknown Title")
        if mbid:
            mbids.append({"mbid": mbid, "title": title})

    return mbids



def fetch_acousticbrainz_highlevel(mbid: str):
    url = f"{AB_BASE}/api/v1/{mbid}/high-level"
    try:
        r = requests.get(url, headers=HEADERS, timeout=8)
        if r.status_code != 200:
            return None
        return r.json()
    except requests.exceptions.RequestException:
        return None


def fetch_acousticbrainz_lowlevel(mbid: str):
    url = f"{AB_BASE}/api/v1/{mbid}/low-level"
    try:
        r = requests.get(url, headers=HEADERS, timeout=8)
        if r.status_code != 200:
            return None
        return r.json()
    except requests.exceptions.RequestException:
        return None


def fetch_acousticbrainz_lowlevel(mbid: str):
    url = f"{AB_BASE}/api/v1/{mbid}/low-level"
    r = requests.get(url, headers=HEADERS, timeout=15)
    if r.status_code != 200:
        return None
    return r.json()

def safe_get_prob(highlevel_json, feature_name: str):
    if not highlevel_json:
        return None
    hl = highlevel_json.get("highlevel", {})
    block = hl.get(feature_name, {})
    return block.get("probability", None)



def mbid_to_candidate(mbid: str, title: str):
    """
    Convert AB highlevel + lowlevel JSON into the 11 feature columns your model expects.
    Missing features are set to 0 (hackathon safe).
    """
    high = fetch_acousticbrainz_highlevel(mbid)
    low = fetch_acousticbrainz_lowlevel(mbid)

    # ----------------------------
    # HIGH-LEVEL (works well)
    # ----------------------------
    danceability = safe_get_prob(high, "danceability")
    mood_happy = safe_get_prob(high, "mood_happy")  # proxy for valence

    # ----------------------------
    # LOW-LEVEL (real numeric stuff)
    # ----------------------------
    lowlevel = (low or {}).get("lowlevel", {})

    # loudness (AB gives 0..1-ish "average_loudness", not Spotify dB)
    avg_loudness = lowlevel.get("average_loudness", 0)

    # tempo (try a few common locations)
    rhythm = (low or {}).get("rhythm", {})
    tempo = rhythm.get("bpm", 0)

    # AB sometimes stores tempo elsewhere; fallback if needed
    if tempo == 0:
        tempo = lowlevel.get("bpm", 0)

    candidate = {
        "song_id": mbid,
        "song_name": title,
        "features": {
            # EEG features don't exist for random candidates, set to 0 for now
            "tbr_mean": 0,
            "tbr_std": 0,

            # AB-derived
            "danceability": float(danceability) if danceability is not None else 0,
            "valence": float(mood_happy) if mood_happy is not None else 0,
            "tempo": float(tempo) if tempo is not None else 0,
            "loudness": float(avg_loudness) if avg_loudness is not None else 0,

            # not easily available from AB in Spotify-style 0..1 format (keep 0 for hackathon)
            "energy": 0,
            "acousticness": 0,
            "instrumentalness": 0,
            "liveness": 0,
            "speechiness": 0,
        }
    }

    return candidate


def get_live_candidates(search_query="pop", limit=50, sleep_sec=0.2):
    """
    Gets candidates by searching MusicBrainz and enriching using AcousticBrainz.
    """
    recordings = search_musicbrainz_recordings(search_query, limit=limit)

    candidates = []
    for rec in recordings:
        mbid = rec["mbid"]
        title = rec["title"]

        cand = mbid_to_candidate(mbid, title)
        if cand:
            candidates.append(cand)

        time.sleep(sleep_sec)  # be polite to public APIs

    return candidates
