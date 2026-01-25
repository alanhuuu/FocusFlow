"""
MongoDB Service - Handles database connections and song response storage
"""
import os
import certifi
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

# Get MongoDB URI from environment
MONGODB_URI = os.getenv("MONGODB_URI")

# Initialize client (lazy connection)
_client = None
_db = None


def get_database():
    """Get MongoDB database instance (singleton pattern)"""
    global _client, _db

    if _db is None:
        if not MONGODB_URI:
            raise ValueError("MONGODB_URI environment variable not set")

        # Use certifi for SSL certificate verification (fixes macOS issue)
        _client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
        _db = _client.focusflow
        print("Connected to MongoDB Atlas")

    return _db


def get_collection(name: str):
    """Get a collection from the database"""
    db = get_database()
    return db[name]


# ============================================
# Song Response CRUD Operations
# ============================================

def save_song_response(
    song_id: str,
    song_name: str,
    artist_name: str,
    tbr_average: float,
    tbr_samples: list[float],
    focus_state: str,
    action: str,
    listened_duration: int,
    total_duration: int,
    audio_features: dict = None,
    user_id: str = "default_user",
    session_id: str = None
) -> str:
    """
    Save a song response with EEG data to MongoDB

    Returns: The inserted document ID as string
    """
    collection = get_collection("song_responses")

    document = {
        "user_id": user_id,
        "song_id": song_id,
        "song_name": song_name,
        "artist_name": artist_name,
        "tbr_average": tbr_average,
        "tbr_samples": tbr_samples,
        "focus_state": focus_state,
        "action": action,  # "skip", "love", "complete"
        "listened_duration": listened_duration,
        "total_duration": total_duration,
        "audio_features": audio_features or {},
        "session_id": session_id,
        "timestamp": datetime.utcnow()
    }

    result = collection.insert_one(document)
    print(f"Saved song response: {song_name} by {artist_name} (TBR: {tbr_average:.2f}, Action: {action})")

    return str(result.inserted_id)


def get_all_song_responses(user_id: str = "default_user", limit: int = 100) -> list:
    """Get all song responses for a user"""
    collection = get_collection("song_responses")

    cursor = collection.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(limit)

    responses = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
        responses.append(doc)

    return responses


def get_song_response_stats(user_id: str = "default_user") -> dict:
    """Get aggregated stats for ML training"""
    collection = get_collection("song_responses")

    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {
            "_id": "$action",
            "count": {"$sum": 1},
            "avg_tbr": {"$avg": "$tbr_average"}
        }}
    ]

    results = list(collection.aggregate(pipeline))

    stats = {
        "total_responses": 0,
        "by_action": {},
        "ready_for_training": False
    }

    for r in results:
        action = r["_id"]
        stats["by_action"][action] = {
            "count": r["count"],
            "avg_tbr": round(r["avg_tbr"], 3)
        }
        stats["total_responses"] += r["count"]

    # Need at least 20 responses to train
    stats["ready_for_training"] = stats["total_responses"] >= 20

    return stats


def get_responses_for_training(user_id: str = "default_user") -> list:
    """Get song responses with audio features for ML training"""
    collection = get_collection("song_responses")

    # Only get responses that have audio features
    cursor = collection.find({
        "user_id": user_id,
        "audio_features": {"$ne": {}}
    })

    responses = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        responses.append(doc)

    return responses


def test_connection() -> bool:
    """Test MongoDB connection"""
    try:
        db = get_database()
        db.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False
