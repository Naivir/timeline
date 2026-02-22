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
    MIN_THEME_HEIGHT_PX = 24.0

    def __init__(self, session: Session) -> None:
        self.repo = ThemeRepository(session)

    def list_themes(self, session_id: str) -> ThemeListResponse:
        rows = self.repo.list_themes(session_id)
        return ThemeListResponse(sessionId=session_id, themes=[self._to_response(row) for row in rows])

    def create_theme(self, session_id: str, payload: ThemeCreateRequest) -> ThemeResponse:
        self._normalize_payload_geometry(payload)
        row = self.repo.create_theme(session_id, payload)
        return self._to_response(row)

    def update_theme(self, session_id: str, theme_id: str, payload: ThemeUpdateRequest) -> ThemeResponse:
        self._normalize_payload_geometry(payload)
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
            abbreviatedTitle=row.abbreviated_title,
            description=row.description,
            tags=json.loads(row.tags_json or '[]'),
            color=row.color,
            opacity=row.opacity,
            priority=row.priority,
            topPx=row.top_px,
            bottomPx=row.bottom_px,
            heightPx=row.bottom_px - row.top_px,
            createdAt=row.created_at,
            updatedAt=row.updated_at,
        )

    @staticmethod
    def _snap4(value: float) -> float:
        return round(value / 4.0) * 4.0

    def _normalize_payload_geometry(self, payload: ThemeCreateRequest | ThemeUpdateRequest) -> None:
        top = getattr(payload, 'topPx', None)
        bottom = getattr(payload, 'bottomPx', None)
        height = getattr(payload, 'heightPx', None)

        if top is not None:
            payload.topPx = self._snap4(top)  # type: ignore[attr-defined]
        if bottom is not None:
            payload.bottomPx = self._snap4(bottom)  # type: ignore[attr-defined]
        if height is not None:
            payload.heightPx = self._snap4(height)  # type: ignore[attr-defined]
        if payload.topPx is not None and payload.bottomPx is not None:
            if payload.bottomPx <= payload.topPx:
                raise ValueError('bottomPx must be greater than topPx')
            if payload.bottomPx - payload.topPx < self.MIN_THEME_HEIGHT_PX:
                payload.bottomPx = payload.topPx + self.MIN_THEME_HEIGHT_PX
            payload.heightPx = payload.bottomPx - payload.topPx  # type: ignore[attr-defined]
