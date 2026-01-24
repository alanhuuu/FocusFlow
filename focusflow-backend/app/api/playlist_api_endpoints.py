from fastapi import APIRouter, Header
from services.apple_music import create_playlist, add_tracks

router = APIRouter()

@router.post("/playlists")
def create(name: str, description: str = "", user_token: str = Header(...)):
    return create_playlist(user_token, name, description)


@router.post("/playlists/{playlist_id}/tracks")
def add(playlist_id: str, track_ids: list[str], user_token: str = Header(...)):
    return add_tracks(user_token, playlist_id, track_ids)