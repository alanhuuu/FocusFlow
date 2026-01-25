import numpy as np
from features import AUDIO_FEATURES, TARGET


def sanitize_dataframe(df):
    """
    Handles invalid numeric values.
    """
    df = df.replace([np.inf, -np.inf], np.nan)

    if "tempo" in df:
        df.loc[df["tempo"] <= 0, "tempo"] = np.nan

    if "energy" in df:
        df.loc[(df["energy"] < 0) | (df["energy"] > 1), "energy"] = np.nan

    return df


def validate_training_data(df):
    """
    Removes unusable rows and enforces types.
    """
    # Drop rows without label
    df = df.dropna(subset=[TARGET])

    # Ensure binary label
    df[TARGET] = df[TARGET].astype(int)

    return df


def select_features(df):
    """
    Enforces feature order.
    """
    return df[AUDIO_FEATURES]
