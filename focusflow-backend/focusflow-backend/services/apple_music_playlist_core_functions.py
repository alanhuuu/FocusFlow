import requests
from .token_generator import generate_developer_token

BASE_URL = "https://api.music.apple.com/v1"

def apple_headers(user_token: str):
    return {
        "Authorization": f"Bearer {generate_developer_token()}",
        "Music-User-Token": user_token,
        "Content-Type": "application/json"
    }


def create_playlist(user_token, name, description=""):
    url = f"{BASE_URL}/me/library/playlists"
    payload = {
        "attributes": {
            "name": name,
            "description": description
        }
    }
    return requests.post(url, json=payload, headers=apple_headers(user_token)).json()


def add_tracks(user_token, playlist_id, track_ids):
    url = f"{BASE_URL}/me/library/playlists/{playlist_id}/tracks"
    payload = [{"id": tid, "type": "songs"} for tid in track_ids]
    return requests.post(url, json=payload, headers=apple_headers(user_token)).json()