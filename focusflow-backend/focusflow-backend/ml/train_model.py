import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from xgboost import XGBClassifier
import joblib


DATA_PATH = Path(__file__).parent / "training_data_mock.json"
MODEL_OUT = Path(__file__).parent / "focus_model.joblib"


# ---------------------------------------------
# Step 1: Load the 20 training entries
# ---------------------------------------------
with open(DATA_PATH, "r") as f:
    data = json.load(f)

rows = []
for item in data:
    eeg = item["eeg"]
    ab = item["acousticbrainz"]

    rows.append(
        {
            "song_id": item["song_id"],
            "song_name": item["song_name"],
            "artist": item["artist"],

            # EEG features
            "tbr_mean": float(eeg["tbr_mean"]),
            "tbr_std": float(eeg["tbr_std"]),

            # AcousticBrainz features
            "danceability": float(ab["danceability"]),
            "energy": float(ab["energy"]),
            "valence": float(ab["valence"]),
            "tempo": float(ab["tempo"]),
            "acousticness": float(ab["acousticness"]),
            "instrumentalness": float(ab["instrumentalness"]),
            "liveness": float(ab["liveness"]),
            "speechiness": float(ab["speechiness"]),
            "loudness": float(ab["loudness"]),
        }
    )

df = pd.DataFrame(rows)


# ---------------------------------------------
# Step 2: Create labels using ONLY TBR
# ---------------------------------------------
# ✅ RULE:
# "Focused" = tbr_mean is in the top 35% of your songs
# (We are not assuming anything about energy/danceability etc.)
threshold = df["tbr_mean"].quantile(0.65)

df["label_focused"] = (df["tbr_mean"] >= threshold).astype(int)

print("\n=== TBR LABELING ===")
print("Threshold (top 35% focused):", round(float(threshold), 3))
print(df[["song_name", "tbr_mean", "label_focused"]].sort_values("tbr_mean", ascending=False))


# ---------------------------------------------
# Step 3: Choose features for training
# ---------------------------------------------
# ✅ We can include EEG + song features
# (This lets the model learn what kinds of songs create focused TBR for YOU)
feature_cols = [
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

X = df[feature_cols].astype(float)
y = df["label_focused"].astype(int)


# ---------------------------------------------
# Step 4: Train/Test split (small dataset)
# ---------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)


# ---------------------------------------------
# Step 5: Train XGBoost
# ---------------------------------------------
model = XGBClassifier(
    n_estimators=200,
    max_depth=3,
    learning_rate=0.08,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42,
    eval_metric="logloss",
)

model.fit(X_train, y_train)


# ---------------------------------------------
# Step 6: Evaluate quickly
# ---------------------------------------------
pred = model.predict(X_test)
print("\n=== MODEL RESULTS ===")
print(classification_report(y_test, pred, digits=3))


# ---------------------------------------------
# Step 7: Save model
# ---------------------------------------------
joblib.dump(
    {
        "model": model,
        "threshold": float(threshold),
        "feature_cols": feature_cols,
    },
    MODEL_OUT,
)

print("\n Saved model to:", MODEL_OUT)
