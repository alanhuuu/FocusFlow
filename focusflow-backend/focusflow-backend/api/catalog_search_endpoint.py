import requests
from fastapi import APIRouter, HTTPException, Query
from fastapi import APIRouter
from ..services.token_generator import generate_developer_token


router = APIRouter()

@router.get("/search")
def search(term: str = Query(..., description="Search term"),
           types: str = Query(..., description="Required Apple Music resource types"),):
    token = generate_developer_token()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    url = "https://api.music.apple.com/v1/catalog/ca/search"

    params = {
        "term": term,
        "limit": 10,
        "types": types,
    }

    response = requests.get(url, headers=headers, params=params)

    # Proper error handling
    if not response.ok:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text
        )

    return response.json()

def search(term: str):
    headers = {"Authorization": f"Bearer {generate_developer_token()}"}
    url = f"https://api.music.apple.com/v1/catalog/us/search"
    params = {"term": term, "types": "songs", "limit": 10}
    return requests.get(url, headers=headers, params=params).json()

