import os
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load .env from the same directory as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

from api import (
    playlist_endpoints,
    catalog_search_endpoint,
    token_endpoint,
    eeg_endpoints,
    recommendations_endpoint,
)


app = FastAPI(title="FocusFlow API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(token_endpoint.router)
app.include_router(playlist_endpoints.router)
app.include_router(catalog_search_endpoint.router)
app.include_router(eeg_endpoints.router)
app.include_router(recommendations_endpoint.router)


@app.get("/")
async def root():
    return {"message": "FocusFlow API", "status": "running"}
