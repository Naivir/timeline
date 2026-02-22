from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from src.models.timeline import ErrorResponse, TimelineResponse
from src.services.timeline_service import TimelineService, TimelineServiceUnavailableError

router = APIRouter(prefix='/api/v1', tags=['timeline'])


def get_timeline_service() -> TimelineService:
    return TimelineService()


@router.get(
    '/timeline',
    response_model=TimelineResponse,
    responses={503: {'model': ErrorResponse}},
)
def get_timeline(service: TimelineService = Depends(get_timeline_service)) -> TimelineResponse | JSONResponse:
    try:
        return service.get_timeline()
    except TimelineServiceUnavailableError as error:
        payload = ErrorResponse(code='SERVICE_UNAVAILABLE', message=str(error))
        return JSONResponse(status_code=503, content=payload.model_dump())
