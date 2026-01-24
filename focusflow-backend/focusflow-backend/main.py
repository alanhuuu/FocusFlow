from fastapi import FastAPI
from .api import playlist_endpoints, catalog_search_endpoint

app = FastAPI()

app.include_router(playlist_endpoints.router)
app.include_router(catalog_search_endpoint.router)