from __future__ import annotations

import json
from datetime import UTC, datetime

from sqlmodel import Session, select

from src.models.memory import TimelineSession
from src.models.theme import Theme
from src.models.theme_schemas import ThemeCreateRequest, ThemeUpdateRequest


class ThemeRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def ensure_session(self, session_id: str) -> TimelineSession:
        existing = self.session.get(TimelineSession, session_id)
        if existing:
            return existing
        created = TimelineSession(id=session_id)
        self.session.add(created)
        self.session.commit()
        self.session.refresh(created)
        return created

    def list_themes(self, session_id: str) -> list[Theme]:
        statement = (
            select(Theme)
            .where(Theme.session_id == session_id)
            .order_by(Theme.priority.asc(), Theme.created_at.asc(), Theme.id.asc())
        )
        return list(self.session.exec(statement))

    def create_theme(self, session_id: str, payload: ThemeCreateRequest) -> Theme:
        self.ensure_session(session_id)
        theme = Theme(
            session_id=session_id,
            start_time=payload.startTime,
            end_time=payload.endTime,
            title=payload.title,
            description=payload.description,
            tags_json=json.dumps(payload.tags),
            color=payload.color,
            opacity=payload.opacity,
            priority=payload.priority,
            height_px=payload.heightPx,
        )
        theme.ensure_valid()
        self.session.add(theme)
        self.session.commit()
        self.session.refresh(theme)
        return theme

    def update_theme(self, session_id: str, theme_id: str, payload: ThemeUpdateRequest) -> Theme | None:
        theme = self.session.get(Theme, theme_id)
        if not theme or theme.session_id != session_id:
            return None
        if payload.startTime is not None:
            theme.start_time = payload.startTime
        if payload.endTime is not None:
            theme.end_time = payload.endTime
        if payload.title is not None:
            theme.title = payload.title
        if payload.description is not None:
            theme.description = payload.description
        if payload.tags is not None:
            theme.tags_json = json.dumps(payload.tags)
        if payload.color is not None:
            theme.color = payload.color
        if payload.opacity is not None:
            theme.opacity = payload.opacity
        if payload.priority is not None:
            theme.priority = payload.priority
        if payload.heightPx is not None:
            theme.height_px = payload.heightPx
        theme.updated_at = datetime.now(UTC)
        theme.ensure_valid()
        self.session.add(theme)
        self.session.commit()
        self.session.refresh(theme)
        return theme

    def delete_theme(self, session_id: str, theme_id: str) -> bool:
        theme = self.session.get(Theme, theme_id)
        if not theme or theme.session_id != session_id:
            return False
        self.session.delete(theme)
        self.session.commit()
        return True

