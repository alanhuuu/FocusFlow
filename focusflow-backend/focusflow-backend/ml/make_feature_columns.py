import json
from pathlib import Path

INPUT_PATH = Path("ml/training_songs.json")  # <-- CHANGE THIS to your real training file
OUT_PATH = Path("ml/feature_columns.json")

def main():
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"❌ Training JSON not found: {INPUT_PATH}")

    data = json.loads(INPUT_PATH.read_text(encoding="utf-8"))

    # assume it's a list of songs
    first = data[0]

    # your structure might be: song["features"] holds acousticbrainz stuff
    features = first.get("features", None)
    if features is None:
        raise ValueError("❌ Couldn't find 'features' inside the first training song object.")

    cols = list(features.keys())

    OUT_PATH.write_text(json.dumps(cols, indent=2), encoding="utf-8")
    print(f"✅ Saved {len(cols)} feature columns to {OUT_PATH}")

if __name__ == "__main__":
    main()
