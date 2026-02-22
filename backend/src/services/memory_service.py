from __future__ import annotations

from datetime import UTC, datetime
import json

from sqlmodel import Session

from src.models.memory import AnchorType, Memory
from src.models.memory_schemas import (
    DeleteMemoryResponse,
    MemoryCreateRequest,
    MemoryListResponse,
    MemoryResponse,
    MemoryUpdateRequest,
    PointAnchor,
    RangeAnchor,
)
from src.repositories.memory_repository import MemoryRepository


class MemoryNotFoundError(Exception):
    pass


class UndoExpiredError(Exception):
    pass


class MemoryService:
    def __init__(self, session: Session) -> None:
        self.repo = MemoryRepository(session)

    def list_memories(self, session_id: str) -> MemoryListResponse:
        rows = self.repo.list_memories(session_id)
        return MemoryListResponse(memories=[self._to_response(row) for row in rows])

    def create_memory(self, session_id: str, payload: MemoryCreateRequest) -> MemoryResponse:
        row = self.repo.create_memory(session_id, payload)
        return self._to_response(row)

    def update_memory(self, session_id: str, memory_id: str, payload: MemoryUpdateRequest) -> MemoryResponse:
        row = self.repo.update_memory(session_id, memory_id, payload)
        if row is None:
            raise MemoryNotFoundError(memory_id)
        return self._to_response(row)

    def delete_memory(self, session_id: str, memory_id: str) -> DeleteMemoryResponse:
        deletion = self.repo.delete_memory(session_id, memory_id)
        if deletion is None:
            raise MemoryNotFoundError(memory_id)
        return DeleteMemoryResponse(deletionId=deletion.deletion_id, undoExpiresAt=deletion.expires_at)

    def undo_delete(self, session_id: str, deletion_id: str) -> MemoryResponse:
        row = self.repo.undo_delete(session_id, deletion_id)
        if row is None:
            # disambiguate missing vs expired by checking deletion record directly
            raise UndoExpiredError(deletion_id)
        return self._to_response(row)

    def _to_response(self, row: Memory) -> MemoryResponse:
        if row.anchor_type == AnchorType.POINT:
            anchor = PointAnchor(type='point', timestamp=row.timestamp or datetime.now(UTC))
        else:
            anchor = RangeAnchor(type='range', start=row.range_start or datetime.now(UTC), end=row.range_end or datetime.now(UTC))

        return MemoryResponse(
            id=row.id,
            sessionId=row.session_id,
            anchor=anchor,
            title=row.title,
            description=row.description,
            tags=json.loads(row.tags_json or '[]'),
            verticalRatio=row.vertical_ratio,
            createdAt=row.created_at,
            updatedAt=row.updated_at,
        )
