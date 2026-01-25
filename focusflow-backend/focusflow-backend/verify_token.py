
import os
from pathlib import Path
from dotenv import load_dotenv
import jwt
from services.token_generator import generate_developer_token, APPLE_TEAM_ID, APPLE_KEY_ID

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

try:
    print(f"Loading .env from: {env_path}")
    # Force reload of variables in token_generator by re-importing or validiting os.environ
    # Since token_generator reads os.getenv at module level, we might need to reload it or just trust the function uses the global vars if they were dynamic (they are not).
    # actually token_generator constants are read at import time.
    # So we need to ensure separate process OR set env before import. 
    # But since I'm running this script as main, I need to handle it.
    
    # Check if variables are set
    print(f"Team ID in Env: {os.getenv('APPLE_TEAM_ID')}")
    print(f"Key ID in Env: {os.getenv('APPLE_KEY_ID')}")
    
    # We need to manually re-read the function logic because the module level constants in token_generator 
    # might be None if imported before load_dotenv (which happened above).
    
    # Let's just re-implement the generation here for verification using the same file path
    private_key_path = os.getenv("APPLE_PRIVATE_KEY_PATH")
    print(f"Key Path: {private_key_path}")
    
    with open(private_key_path, "r") as f:
        private_key = f.read()
        
    import time
    token = jwt.encode(
        {
            "iss": os.getenv("APPLE_TEAM_ID"),
            "iat": int(time.time()),
            "exp": int(time.time()) + 15777000
        },
        private_key,
        algorithm="ES256",
        headers={"kid": os.getenv("APPLE_KEY_ID")}
    )
    
    print("\n--- Generated Token ---")
    print(token)
    
    print("\n--- Decoded Header ---")
    print(jwt.get_unverified_header(token))
    
    print("\n--- Decoded Claims ---")
    print(jwt.decode(token, options={"verify_signature": False}))
    
except Exception as e:
    print(f"Error: {e}")
