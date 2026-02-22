from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from src.db import get_session
from src.models.theme_schemas import ThemeCreateRequest, ThemeListResponse, ThemeResponse, ThemeUpdateRequest
from src.services.theme_service import ThemeNotFoundError, ThemeService

router = APIRouter(prefix='/api/v1/sessions/{session_id}/themes', tags=['themes'])


def get_theme_service(session: Session = Depends(get_session)) -> ThemeService:
    return ThemeService(session)


@router.get('', response_model=ThemeListResponse)
def list_themes(session_id: str, service: ThemeService = Depends(get_theme_service)) -> ThemeListResponse:
    return service.list_themes(session_id)


@router.post('', status_code=status.HTTP_201_CREATED, response_model=ThemeResponse)
def create_theme(
    session_id: str,
    payload: ThemeCreateRequest,
    service: ThemeService = Depends(get_theme_service),
) -> ThemeResponse:
    try:
        return service.create_theme(session_id, payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@router.patch('/{theme_id}', response_model=ThemeResponse)
def update_theme(
    session_id: str,
    theme_id: str,
    payload: ThemeUpdateRequest,
    service: ThemeService = Depends(get_theme_service),
) -> ThemeResponse:
    try:
        return service.update_theme(session_id, theme_id, payload)
    except ThemeNotFoundError as error:
        raise HTTPException(status_code=404, detail=f'Theme not found: {error}') from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@router.delete('/{theme_id}', status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_theme(
    session_id: str,
    theme_id: str,
    service: ThemeService = Depends(get_theme_service),
) -> Response:
    try:
        service.delete_theme(session_id, theme_id)
    except ThemeNotFoundError as error:
        raise HTTPException(status_code=404, detail=f'Theme not found: {error}') from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
