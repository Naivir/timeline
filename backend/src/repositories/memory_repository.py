from __future__ import annotations

import json
from datetime import UTC, datetime

from sqlmodel import Session, select

from src.models.memory import AnchorType, Memory, TimelineSession
from src.models.memory_schemas import MemoryCreateRequest, MemoryUpdateRequest


class MemoryRepository:
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

    def list_memories(self, session_id: str) -> list[Memory]:
        statement = select(Memory).where(Memory.session_id == session_id)
        return list(self.session.exec(statement))

    def create_memory(self, session_id: str, payload: MemoryCreateRequest) -> Memory:
        self.ensure_session(session_id)

        memory = Memory(
            session_id=session_id,
            anchor_type=AnchorType(payload.anchor.type),
            timestamp=getattr(payload.anchor, 'timestamp', None),
            range_start=getattr(payload.anchor, 'start', None),
            range_end=getattr(payload.anchor, 'end', None),
            title=payload.title,
            description=payload.description,
            tags_json=json.dumps(payload.tags),
            vertical_ratio=payload.verticalRatio,
        )
        memory.ensure_valid_anchor()
        self.session.add(memory)
        self.session.commit()
        self.session.refresh(memory)
        return memory

    def update_memory(self, session_id: str, memory_id: str, payload: MemoryUpdateRequest) -> Memory | None:
        memory = self.session.get(Memory, memory_id)
        if not memory or memory.session_id != session_id:
            return None

        if payload.anchor is not None:
            memory.anchor_type = AnchorType(payload.anchor.type)
            memory.timestamp = getattr(payload.anchor, 'timestamp', None)
            memory.range_start = getattr(payload.anchor, 'start', None)
            memory.range_end = getattr(payload.anchor, 'end', None)

        if payload.title is not None:
            memory.title = payload.title
        if payload.description is not None:
            memory.description = payload.description
        if payload.tags is not None:
            memory.tags_json = json.dumps(payload.tags)
        if payload.verticalRatio is not None:
            memory.vertical_ratio = payload.verticalRatio

        memory.updated_at = datetime.now(UTC)
        memory.ensure_valid_anchor()

        self.session.add(memory)
        self.session.commit()
        self.session.refresh(memory)
        return memory

    def delete_memory(self, session_id: str, memory_id: str) -> bool:
        memory = self.session.get(Memory, memory_id)
        if not memory or memory.session_id != session_id:
            return False
        self.session.delete(memory)
        self.session.commit()
        return True
