import jwt
import time
import os
from pathlib import Path

# APPLE_TEAM_ID = os.getenv("APPLE_TEAM_ID")
# APPLE_KEY_ID = os.getenv("APPLE_KEY_ID")
# PRIVATE_KEY_PATH = os.getenv("APPLE_PRIVATE_KEY_PATH")

# BASE_DIR = Path(__file__).resolve().parent.parent

APPLE_TEAM_ID = "Q7ZLXMG4SB"
APPLE_KEY_ID = "88B2L2KSK6"
PRIVATE_KEY_PATH = "./keys/AuthKey_88B2L2KSK6.p8"



def generate_developer_token():
    with open(PRIVATE_KEY_PATH, "r") as f:
        private_key = f.read()

    payload = {
        "iss": APPLE_TEAM_ID,
        "iat": int(time.time()),
        "exp": int(time.time()) + 15777000  # ~6 months
    }

    token = jwt.encode(
        payload,
        private_key,
        algorithm="ES256",
        headers={"kid": APPLE_KEY_ID}
    )

    return token