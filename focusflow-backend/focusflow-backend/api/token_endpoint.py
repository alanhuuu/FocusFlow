from fastapi import APIRouter
from services.token_generator import generate_developer_token


router = APIRouter()

@router.get("/token")
def get_token():
    return {"token": generate_developer_token()}
