from fastapi import APIRouter

from src.api.health import router as health_router
from src.api.memories import router as memories_router
from src.api.themes import router as themes_router
from src.api.timeline import router as timeline_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(timeline_router)
api_router.include_router(memories_router)
api_router.include_router(themes_router)
