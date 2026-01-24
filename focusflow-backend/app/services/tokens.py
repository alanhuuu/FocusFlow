import jwt
import time

APPLE_TEAM_ID = "YOUR_TEAM_ID"
APPLE_KEY_ID = "YOUR_KEY_ID"
PRIVATE_KEY_PATH = "keys/AuthKey_XXXXXX.p8"

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