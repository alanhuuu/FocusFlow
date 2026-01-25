"""
Song Response API Endpoints - Store and retrieve EEG + song data
"""
import asyncio
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
    delete_all_responses,
    get_response_count
)
from services.acousticbrainz_service import get_audio_features, get_musicbrainz_id, get_acousticbrainz_features
from ml.music_discovery import discover_new_music

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


class RecommendationItem(BaseModel):
    song_id: str
    song_name: str
    artist_name: str
    focus_score: float


class SongResponseOut(BaseModel):
    id: str
    message: str
    audio_features: dict
    recommendations: Optional[list[RecommendationItem]] = None
    song_count: int = 0


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
        print(f"REJECTED {data.song_name}: Only {len(data.tbr_samples) if data.tbr_samples else 0} TBR samples (need 3+)")
        raise HTTPException(
            status_code=400,
            detail=f"No EEG data - only {len(data.tbr_samples) if data.tbr_samples else 0} TBR samples (need 3+)"
        )

    # Reject if listened for less than 10 seconds
    if data.listened_duration < 10:
        print(f"REJECTED {data.song_name}: Only listened {data.listened_duration}s (need 10+)")
        raise HTTPException(
            status_code=400,
            detail=f"Listened only {data.listened_duration}s - need at least 10 seconds"
        )

    try:
        # Get audio features for this song (run in thread to avoid blocking EEG WebSocket)
        audio_features = await asyncio.to_thread(
            get_audio_features,
            data.song_id,
            data.song_name,
            data.artist_name
        )

        # Reject if song not in AcousticBrainz (only estimated features)
        if audio_features.get("source") != "acousticbrainz":
            print(f"REJECTED {data.song_name}: Not in AcousticBrainz")
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

        # Check if we have enough data for ML recommendations
        song_count = get_response_count()
        recommendations = None

        if song_count >= 8:
            try:
                # Run ML in a thread pool to avoid blocking the event loop (keeps EEG WebSocket alive)
                recs = await asyncio.to_thread(
                    discover_new_music,
                    min_entries=8,
                    top_k=3
                )
                if recs:
                    recommendations = [
                        RecommendationItem(
                            song_id=r.get("mbid", ""),  # Use MBID as song_id
                            song_name=r["song_name"],
                            artist_name=r["artist_name"],
                            focus_score=r["focus_score"]
                        )
                        for r in recs
                    ]
                    print(f"Discovered {len(recommendations)} NEW songs")
            except Exception as e:
                print(f"Music discovery failed: {e}")
                import traceback
                traceback.print_exc()
                # Don't fail the whole request if ML fails

        return SongResponseOut(
            id=doc_id,
            message=f"Saved response for '{data.song_name}'",
            audio_features=audio_features,
            recommendations=recommendations,
            song_count=song_count
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
            "ready_for_training": len(responses) >= 3,  # Changed from 20 to 3 for testing
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
