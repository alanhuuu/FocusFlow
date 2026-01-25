import json
import numpy as np
import joblib
from pathlib import Path


# -----------------------------------
# CONFIG
# -----------------------------------
MODEL_PATH = Path("ml/focus_model.joblib")
MOCK_CANDIDATES_PATH = Path("ml/mock_candidates_500.json")


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"❌ Model not found at {MODEL_PATH}")

    obj = joblib.load(MODEL_PATH)

    # If model saved directly
    if hasattr(obj, "predict_proba"):
        print(f"✅ Loaded model directly from: {MODEL_PATH}")
        return obj, None

    # If saved as package dict (your case)
    if isinstance(obj, dict):
        print(f"✅ Loaded dict package from: {MODEL_PATH}")
        print(f"📦 Keys inside joblib: {list(obj.keys())}")

        model = obj["model"]
        feature_cols = obj.get("feature_cols")

        if feature_cols is None:
            raise ValueError("❌ No feature_cols found inside the joblib dict.")

        print(f"✅ Found model under key: 'model'")
        print(f"✅ Model expects {len(feature_cols)} features")

        return model, feature_cols

    raise ValueError(f"❌ Unexpected joblib content type: {type(obj)}")




def load_candidate_songs(feature_cols):
    from data.mongo_loader import fetch_song_docs
    from ml.alan_json_adapter import alan_doc_to_candidate

    docs = fetch_song_docs(limit=200)

    seen = set()
    candidates = []

    for d in docs:
        sid = str(d.get("song_id"))
        if sid in seen:
            continue
        seen.add(sid)

        candidate = alan_doc_to_candidate(d, feature_cols=feature_cols)


        candidates.append(candidate)

    print(f"✅ Loaded {len(candidates)} UNIQUE candidate songs from MongoDB")
    return candidates






def build_feature_matrix(candidate_songs):
    """
    Converts your list of candidate songs into:
    - X = numpy array (n_songs, n_features)
    - keeps track of (song_id, song_name) for output

    🔥 IMPORTANT:
    We MUST use the SAME exact feature columns that training used.

    So we rely on `model.feature_names_in_` (if available).
    """

    # We'll fill this after we load the model (because we need feature_names_in_)
    return None


def recommend_top_k(model, candidate_songs, feature_cols, top_k=20):
    """
    Steps:
    1) build X features using feature_cols (from saved model package)
    2) p_focus = predict_proba(X)[:, 1]
    3) rank descending
    4) return top K
    """

    if feature_cols is None:
        raise ValueError("❌ feature_cols is None. Can't build feature matrix.")

    # ✅ Build X in EXACT same order as feature_cols
    X = []
    meta = []

    for song in candidate_songs:
        song_id = song.get("song_id", "unknown_id")
        song_name = song.get("song_name", "unknown_song")

        features = song.get("features", {})
        row = []

        for col in feature_cols:
            val = features.get(col, 0)  # hackathon-safe fallback
            row.append(val)

        X.append(row)
        meta.append((song_id, song_name))

    X = np.array(X, dtype=float)

    # ✅ Predict probability of focus
    probs = model.predict_proba(X)[:, 1]

    # ✅ Sort descending
    ranked_indices = np.argsort(-probs)

    recommendations = []
    for idx in ranked_indices[:top_k]:
        song_id, song_name = meta[idx]
        recommendations.append(
            {
                "song_id": song_id,
                "song_name": song_name,
                "p_focus": float(probs[idx]),
            }
        )

    return recommendations




def main():
    model, feature_cols = load_model()
    candidate_songs = load_candidate_songs(feature_cols)
    top_3 = recommend_top_k(model, candidate_songs, feature_cols=feature_cols, top_k=3)

    print("\n🎧 TOP 3 FOCUSFLOW RECOMMENDATIONS:\n")
    print(json.dumps(top_3, indent=2))



if __name__ == "__main__":
    main()
