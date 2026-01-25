"""
Song Response API Endpoints - Store and retrieve EEG + song data
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.mongodb_service import (
    save_song_response,
    get_all_song_responses,
    get_song_response_stats,
    get_responses_for_training,
    test_connection
)
from services.acousticbrainz_service import get_audio_features

router = APIRouter(prefix="/responses", tags=["Song Responses"])


# ============================================
# Request/Response Models
# ============================================

class SongResponseCreate(BaseModel):
    song_id: str
    song_name: str
    artist_name: str
    tbr_average: float
    tbr_samples: list[float] = []
    focus_state: str  # "FOCUSED", "NEUTRAL", "DISTRACTED"
    action: str  # "skip", "love", "complete"
    listened_duration: int  # seconds
    total_duration: int  # seconds
    session_id: Optional[str] = None


class SongResponseOut(BaseModel):
    id: str
    message: str
    audio_features: dict


# ============================================
# Endpoints
# ============================================

@router.get("/health")
async def health_check():
    """Test MongoDB connection"""
    connected = test_connection()
    if connected:
        return {"status": "ok", "mongodb": "connected"}
    else:
        raise HTTPException(status_code=500, detail="MongoDB connection failed")


@router.post("/", response_model=SongResponseOut)
async def create_song_response(data: SongResponseCreate):
    """
    Save a song response with EEG data.
    Automatically fetches audio features for the song.
    """
    try:
        # Get audio features for this song
        audio_features = get_audio_features(
            data.song_id,
            data.song_name,
            data.artist_name
        )

        # Save to MongoDB
        doc_id = save_song_response(
            song_id=data.song_id,
            song_name=data.song_name,
            artist_name=data.artist_name,
            tbr_average=data.tbr_average,
            tbr_samples=data.tbr_samples,
            focus_state=data.focus_state,
            action=data.action,
            listened_duration=data.listened_duration,
            total_duration=data.total_duration,
            audio_features=audio_features,
            session_id=data.session_id
        )

        return SongResponseOut(
            id=doc_id,
            message=f"Saved response for '{data.song_name}'",
            audio_features=audio_features
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_responses(limit: int = 100):
    """Get all song responses for the current user"""
    try:
        responses = get_all_song_responses(limit=limit)
        return {"count": len(responses), "responses": responses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_stats():
    """
    Get aggregated statistics for song responses.
    Shows counts by action type and readiness for ML training.
    """
    try:
        stats = get_song_response_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/training-data")
async def get_training_data():
    """
    Get song responses formatted for ML training.
    Only includes responses with audio features.
    """
    try:
        responses = get_responses_for_training()
        return {
            "count": len(responses),
            "ready_for_training": len(responses) >= 20,
            "data": responses
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
