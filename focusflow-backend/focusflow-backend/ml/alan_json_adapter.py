def alan_doc_to_candidate(doc: dict, feature_cols: list):
    audio = doc.get("audio_features", {}) or {}

    features = {
        "tbr_mean": float(doc.get("tbr_average", 0) or 0),
        "tbr_std": 0.0,

        "danceability": float(audio.get("danceability", 0) or 0),
        "energy": float(audio.get("energy", 0) or 0),
        "valence": float(audio.get("valence", 0) or 0),
        "tempo": float(audio.get("tempo", 0) or 0),

        "acousticness": float(audio.get("acousticness", 0) or 0),
        "instrumentalness": float(audio.get("instrumentalness", 0) or 0),
        "liveness": float(audio.get("liveness", 0) or 0),
        "speechiness": float(audio.get("speechiness", 0) or 0),

        # Mongo does NOT provide loudness → keep 0
        "loudness": 0.0,
    }

    final_features = {col: float(features.get(col, 0) or 0) for col in feature_cols}

    return {
        "song_id": str(doc.get("song_id", "")),
        "song_name": doc.get("song_name", "unknown"),
        "features": final_features
    }
