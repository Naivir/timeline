from __future__ import annotations

import json

from sqlmodel import Session

from src.models.theme import Theme
from src.models.theme_schemas import (
    ThemeCreateRequest,
    ThemeListResponse,
    ThemeResponse,
    ThemeUpdateRequest,
)
from src.repositories.theme_repository import ThemeRepository


class ThemeNotFoundError(Exception):
    pass


class ThemeService:
    def __init__(self, session: Session) -> None:
        self.repo = ThemeRepository(session)

    def list_themes(self, session_id: str) -> ThemeListResponse:
        rows = self.repo.list_themes(session_id)
        return ThemeListResponse(sessionId=session_id, themes=[self._to_response(row) for row in rows])

    def create_theme(self, session_id: str, payload: ThemeCreateRequest) -> ThemeResponse:
        row = self.repo.create_theme(session_id, payload)
        return self._to_response(row)

    def update_theme(self, session_id: str, theme_id: str, payload: ThemeUpdateRequest) -> ThemeResponse:
        row = self.repo.update_theme(session_id, theme_id, payload)
        if row is None:
            raise ThemeNotFoundError(theme_id)
        return self._to_response(row)

    def delete_theme(self, session_id: str, theme_id: str) -> None:
        deleted = self.repo.delete_theme(session_id, theme_id)
        if not deleted:
            raise ThemeNotFoundError(theme_id)

    def _to_response(self, row: Theme) -> ThemeResponse:
        return ThemeResponse(
            id=row.id,
            sessionId=row.session_id,
            startTime=row.start_time,
            endTime=row.end_time,
            title=row.title,
            description=row.description,
            tags=json.loads(row.tags_json or '[]'),
            color=row.color,
            opacity=row.opacity,
            priority=row.priority,
            heightPx=row.height_px,
            createdAt=row.created_at,
            updatedAt=row.updated_at,
        )

