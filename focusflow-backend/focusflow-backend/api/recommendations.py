from fastapi import APIRouter, Query
from pathlib import Path
import json

from ml.recommend_songs import load_model, load_candidate_songs, recommend_top_k

router = APIRouter()

@router.get("/recommendations/top")
def get_top_recommendations(limit: int = Query(20, ge=1, le=100)):
    model, feature_cols = load_model()
    candidates = load_candidate_songs()

    top_songs = recommend_top_k(model, candidates, feature_cols=feature_cols, top_k=limit)

    return top_songs
