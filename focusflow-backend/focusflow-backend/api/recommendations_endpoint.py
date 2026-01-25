from fastapi import APIRouter, Query
from ml.recommend_songs import load_model, load_candidate_songs, recommend_top_k

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/top")
def get_top_recommendations(limit: int = Query(3, ge=1, le=100)):
    model, feature_cols = load_model()
    candidates = load_candidate_songs()

    top_songs = recommend_top_k(
        model,
        candidates,
        feature_cols=feature_cols,
        top_k=limit
    )

    return top_songs
