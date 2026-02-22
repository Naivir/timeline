from __future__ import annotations

from fastapi import APIRouter

from src.models.health import ServiceState, ServiceStatus
from src.models.timeline import utc_now

router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get("/health", response_model=ServiceStatus)
def get_health() -> ServiceStatus:
    return ServiceStatus(status=ServiceState.OK, message="timeline service healthy", checkedAt=utc_now())
