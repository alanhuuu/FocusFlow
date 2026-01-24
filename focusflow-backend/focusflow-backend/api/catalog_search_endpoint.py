import requests
from fastapi import APIRouter
from ..services.token_generator import generate_developer_token

router = APIRouter()

@router.get("/search")
def search(term: str):
    headers = {"Authorization": f"Bearer {generate_developer_token()}"}
    url = f"https://api.music.apple.com/v1/catalog/us/search"
    params = {"term": term, "types": "songs", "limit": 10}
    return requests.get(url, headers=headers, params=params).json()