from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from src.db import get_session
from src.models.memory_schemas import (
    MemoryCreateRequest,
    MemoryListResponse,
    MemoryResponse,
    MemoryUpdateRequest,
)
from src.services.memory_service import MemoryNotFoundError, MemoryService

router = APIRouter(prefix='/api/v1/sessions/{session_id}/memories', tags=['memories'])


def get_memory_service(session: Session = Depends(get_session)) -> MemoryService:
    return MemoryService(session)


@router.get('', response_model=MemoryListResponse)
def list_memories(session_id: str, service: MemoryService = Depends(get_memory_service)) -> MemoryListResponse:
    return service.list_memories(session_id)


@router.post('', status_code=status.HTTP_201_CREATED, response_model=MemoryResponse)
def create_memory(
    session_id: str,
    payload: MemoryCreateRequest,
    service: MemoryService = Depends(get_memory_service),
) -> MemoryResponse:
    return service.create_memory(session_id, payload)


@router.patch('/{memory_id}', response_model=MemoryResponse)
def update_memory(
    session_id: str,
    memory_id: str,
    payload: MemoryUpdateRequest,
    service: MemoryService = Depends(get_memory_service),
) -> MemoryResponse:
    try:
        return service.update_memory(session_id, memory_id, payload)
    except MemoryNotFoundError as error:
        raise HTTPException(status_code=404, detail=f'Memory not found: {error}') from error


@router.delete('/{memory_id}', status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_memory(
    session_id: str,
    memory_id: str,
    service: MemoryService = Depends(get_memory_service),
) -> Response:
    try:
        service.delete_memory(session_id, memory_id)
    except MemoryNotFoundError as error:
        raise HTTPException(status_code=404, detail=f'Memory not found: {error}') from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
