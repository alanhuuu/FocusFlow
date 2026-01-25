"""
Live ML Training and Recommendations
Trains XGBoost model from MongoDB data and returns recommendations
"""
import numpy as np
from xgboost import XGBClassifier
from services.mongodb_service import get_responses_for_training, get_collection


# Feature columns used for training
FEATURE_COLS = [
    "tbr_mean",
    "tbr_std",
    "danceability",
    "energy",
    "valence",
    "tempo",
    "acousticness",
    "instrumentalness",
    "liveness",
    "speechiness",
    "loudness",
]


def extract_features_from_doc(doc: dict) -> dict:
    """Extract features from a MongoDB document"""
    audio = doc.get("audio_features", {}) or {}
    tbr_samples = doc.get("tbr_samples", []) or []

    tbr_mean = float(doc.get("tbr_average", 0) or 0)
    tbr_std = float(np.std(tbr_samples)) if len(tbr_samples) > 1 else 0.0

    return {
        "tbr_mean": tbr_mean,
        "tbr_std": tbr_std,
        "danceability": float(audio.get("danceability", 0) or 0),
        "energy": float(audio.get("energy", 0) or 0),
        "valence": float(audio.get("valence", 0) or 0),
        "tempo": float(audio.get("tempo", 0) or 0),
        "acousticness": float(audio.get("acousticness", 0) or 0),
        "instrumentalness": float(audio.get("instrumentalness", 0) or 0),
        "liveness": float(audio.get("liveness", 0) or 0),
        "speechiness": float(audio.get("speechiness", 0) or 0),
        "loudness": float(audio.get("loudness", 0) or 0),
    }


def train_model_from_mongodb(min_entries: int = 3):
    """
    Train XGBoost model from MongoDB song responses.

    Returns: (model, feature_cols, threshold) or None if not enough data
    """
    responses = get_responses_for_training()

    if len(responses) < min_entries:
        print(f"Not enough data: {len(responses)} < {min_entries}")
        return None

    # Build feature matrix
    X = []
    tbr_means = []

    for doc in responses:
        features = extract_features_from_doc(doc)
        row = [features[col] for col in FEATURE_COLS]
        X.append(row)
        tbr_means.append(features["tbr_mean"])

    X = np.array(X, dtype=float)
    tbr_means = np.array(tbr_means)

    # Create labels: top 35% TBR = focused
    threshold = np.quantile(tbr_means, 0.65)
    y = (tbr_means >= threshold).astype(int)

    # Train XGBoost (lighter config for small datasets)
    model = XGBClassifier(
        n_estimators=50,  # Fewer trees for small data
        max_depth=2,      # Shallower for small data
        learning_rate=0.1,
        random_state=42,
        eval_metric="logloss",
    )

    model.fit(X, y)
    print(f"Trained model on {len(responses)} songs (threshold: {threshold:.3f})")

    return model, FEATURE_COLS, threshold


def get_candidate_songs(exclude_song_ids: set = None, limit: int = 50):
    """
    Get candidate songs from MongoDB for recommendations.
    Excludes songs the user has already listened to if specified.
    """
    collection = get_collection("song_responses")

    # Get all unique songs with audio features
    pipeline = [
        {"$match": {"audio_features": {"$ne": {}}}},
        {"$group": {
            "_id": "$song_id",
            "song_name": {"$first": "$song_name"},
            "artist_name": {"$first": "$artist_name"},
            "audio_features": {"$first": "$audio_features"},
            "tbr_average": {"$avg": "$tbr_average"},
            "tbr_samples": {"$first": "$tbr_samples"},
        }},
        {"$limit": limit}
    ]

    candidates = []
    for doc in collection.aggregate(pipeline):
        song_id = str(doc["_id"])

        # Skip if already listened
        if exclude_song_ids and song_id in exclude_song_ids:
            continue

        candidates.append({
            "song_id": song_id,
            "song_name": doc["song_name"],
            "artist_name": doc.get("artist_name", "Unknown"),
            "audio_features": doc["audio_features"],
            "tbr_average": doc.get("tbr_average", 0),
            "tbr_samples": doc.get("tbr_samples", []),
        })

    return candidates


def recommend_songs(model, feature_cols, candidates, top_k: int = 3):
    """
    Score candidate songs and return top K recommendations.
    """
    if not candidates:
        return []

    # Build feature matrix for candidates
    X = []
    meta = []

    for song in candidates:
        features = extract_features_from_doc(song)
        row = [features[col] for col in feature_cols]
        X.append(row)
        meta.append({
            "song_id": song["song_id"],
            "song_name": song["song_name"],
            "artist_name": song.get("artist_name", "Unknown"),
        })

    X = np.array(X, dtype=float)

    # Predict probability of focus
    probs = model.predict_proba(X)[:, 1]

    # Sort descending by focus probability
    ranked_indices = np.argsort(-probs)

    recommendations = []
    for idx in ranked_indices[:top_k]:
        recommendations.append({
            "song_id": meta[idx]["song_id"],
            "song_name": meta[idx]["song_name"],
            "artist_name": meta[idx]["artist_name"],
            "focus_score": round(float(probs[idx]), 3),
        })

    return recommendations


def train_and_recommend(min_entries: int = 3, top_k: int = 3, exclude_song_ids: set = None):
    """
    Main function: Train model from MongoDB and return recommendations.

    Returns:
        - None if not enough data
        - List of recommendations if successful
    """
    # Train model
    result = train_model_from_mongodb(min_entries=min_entries)
    if result is None:
        return None

    model, feature_cols, threshold = result

    # Get candidate songs
    candidates = get_candidate_songs(exclude_song_ids=exclude_song_ids)

    if not candidates:
        print("No candidate songs found")
        return []

    # Get recommendations
    recommendations = recommend_songs(model, feature_cols, candidates, top_k=top_k)

    return recommendations
