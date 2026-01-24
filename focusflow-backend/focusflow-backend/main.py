from dotenv import load_dotenv
load_dotenv(".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import playlist_endpoints, catalog_search_endpoint, token_endpoint



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(token_endpoint.router)
app.include_router(playlist_endpoints.router)
app.include_router(catalog_search_endpoint.router)
