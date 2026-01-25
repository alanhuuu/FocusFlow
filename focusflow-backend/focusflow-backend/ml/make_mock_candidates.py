import json
import random
import joblib
from pathlib import Path

MODEL_PATH = Path("ml/focus_model.joblib")
OUT_PATH = Path("ml/mock_candidates_500.json")
N = 500

def main():
    pkg = joblib.load(MODEL_PATH)

    if not isinstance(pkg, dict) or "feature_cols" not in pkg:
        raise ValueError("❌ focus_model.joblib must be a dict containing feature_cols")

    feature_cols = pkg["feature_cols"]
    print(f"✅ Using {len(feature_cols)} features from model package")

    songs = []
    for i in range(N):
        song_id = f"song_{i:03d}"
        song_name = f"Mock Song {i+1}"

        features = {}
        for col in feature_cols:
            # random values (hackathon-safe)
            features[col] = round(random.uniform(0, 1), 4)

        songs.append({
            "song_id": song_id,
            "song_name": song_name,
            "features": features
        })

    OUT_PATH.write_text(json.dumps(songs, indent=2), encoding="utf-8")
    print(f"✅ Wrote {N} mock candidate songs to: {OUT_PATH}")

if __name__ == "__main__":
    main()
