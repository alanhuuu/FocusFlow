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
    test_connection,
    delete_useless_responses,
    delete_all_responses
)
from services.acousticbrainz_service import get_audio_features, get_musicbrainz_id, get_acousticbrainz_features

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
    Automatically fetches audio features from AcousticBrainz.
    Only saves if there's valid EEG data AND song is in AcousticBrainz.
    """
    # Reject if no EEG data
    if not data.tbr_samples or len(data.tbr_samples) < 3:
        raise HTTPException(
            status_code=400,
            detail="No EEG data - need at least 3 TBR samples to save"
        )

    # Reject if listened for less than 10 seconds
    if data.listened_duration < 10:
        raise HTTPException(
            status_code=400,
            detail="Listened for less than 10 seconds - not saving"
        )

    try:
        # Get audio features for this song
        audio_features = get_audio_features(
            data.song_id,
            data.song_name,
            data.artist_name
        )

        # Reject if song not in AcousticBrainz (only estimated features)
        if audio_features.get("source") != "acousticbrainz":
            raise HTTPException(
                status_code=400,
                detail="Song not found in AcousticBrainz - not saving"
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


@router.delete("/cleanup")
async def cleanup_useless_data():
    """
    Delete all responses with no EEG data or very short listen time.
    Removes: empty tbr_samples, tbr_average=0, listened < 10 seconds.
    """
    try:
        deleted_count = delete_useless_responses()
        return {
            "message": f"Cleanup complete",
            "deleted_count": deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/all")
async def delete_all_data():
    """
    Delete ALL song responses. Use with caution!
    """
    try:
        deleted_count = delete_all_responses()
        return {
            "message": "All responses deleted",
            "deleted_count": deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/check-features")
async def check_audio_features(song_name: str, artist_name: str):
    """
    Check if a song has AcousticBrainz data available.
    Returns the source type and features if found.
    """
    try:
        # Get MusicBrainz ID
        mbid = get_musicbrainz_id(song_name, artist_name)

        if not mbid:
            return {
                "has_acousticbrainz": False,
                "source": "estimated",
                "mbid": None,
                "message": "Song not found in MusicBrainz"
            }

        # Try to get AcousticBrainz features
        features = get_acousticbrainz_features(mbid)

        if features:
            return {
                "has_acousticbrainz": True,
                "source": "acousticbrainz",
                "mbid": mbid,
                "features": features,
                "message": "Real audio features available"
            }
        else:
            return {
                "has_acousticbrainz": False,
                "source": "estimated",
                "mbid": mbid,
                "message": "MBID found but no AcousticBrainz data"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
