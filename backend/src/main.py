from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import api_router
from src.db import init_db

app = FastAPI(title="Timeline Foundation API", version="0.1.0")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router)
init_db()


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "timeline-backend", "status": "ok"}
