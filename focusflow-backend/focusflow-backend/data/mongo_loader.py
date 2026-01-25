import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()



def get_mongo_collection():
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB")
    collection_name = os.getenv("MONGO_COLLECTION")

    if not mongo_uri:
        raise ValueError("Missing MONGO_URI in .env")
    if not db_name:
        raise ValueError("Missing MONGO_DB in .env")
    if not collection_name:
        raise ValueError("Missing MONGO_COLLECTION in .env")

    client = MongoClient(mongo_uri)
    db = client[db_name]
    return db[collection_name]


def fetch_song_docs(limit: int = 200):
    col = get_mongo_collection()
    docs = list(col.find({}).sort("timestamp", -1).limit(limit))

    for d in docs:
        if "_id" in d:
            d["_id"] = str(d["_id"])

    return docs
