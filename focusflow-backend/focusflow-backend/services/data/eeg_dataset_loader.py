from pymongo import MongoClient
import pandas as pd

def load_training_dataset(
    mongo_uri: str,
    db_name: str,
    collection_name: str
) -> pd.DataFrame:
    """
    Pull EEG + audio feature training data from MongoDB
    and return as a pandas DataFrame.
    """

    client = MongoClient(mongo_uri)
    collection = client[db_name][collection_name]

    cursor = collection.find({})

    rows = []
    for doc in cursor:
        row = flatten_document(doc)
        rows.append(row)

    return pd.DataFrame(rows)

def flatten_document(doc: dict) -> dict:
    audio = doc.get("audio_features", {})
    eeg = doc.get("eeg", {})

    return {
        "tempo": safe_get(audio, "tempo"),
        "energy": safe_get(audio, "energy"),
        "danceability": safe_get(audio, "danceability"),
        "loudness": safe_get(audio, "loudness"),
        "valence": safe_get(audio, "valence"),
        "spectral_centroid": safe_get(audio, "spectral_centroid"),
        "spectral_bandwidth": safe_get(audio, "spectral_bandwidth"),
        "spectral_rolloff": safe_get(audio, "spectral_rolloff"),
        "key": safe_get(audio, "key"),
        "mode": safe_get(audio, "mode"),

        "alpha": safe_get(eeg, "alpha"),
        "beta": safe_get(eeg, "beta"),
        "theta": safe_get(eeg, "theta"),

        "focused": doc.get("focused"),
        "timestamp": doc.get("timestamp"),
    }

def safe_get(d, key):
    return d.get(key) if isinstance(d, dict) else None
