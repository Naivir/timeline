from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlmodel import Session, select

from src.models.memory import AnchorType, Memory, TimelineSession
from src.models.memory_deletion import MemoryDeletionRecord
from src.models.memory_schemas import MemoryCreateRequest, MemoryUpdateRequest

UNDO_WINDOW_SECONDS = 30


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

    def delete_memory(self, session_id: str, memory_id: str) -> MemoryDeletionRecord | None:
        memory = self.session.get(Memory, memory_id)
        if not memory or memory.session_id != session_id:
            return None

        snapshot: dict[str, Any] = {
            'id': memory.id,
            'session_id': memory.session_id,
            'anchor_type': memory.anchor_type.value,
            'timestamp': memory.timestamp.isoformat() if memory.timestamp else None,
            'range_start': memory.range_start.isoformat() if memory.range_start else None,
            'range_end': memory.range_end.isoformat() if memory.range_end else None,
            'title': memory.title,
            'description': memory.description,
            'tags_json': memory.tags_json,
            'vertical_ratio': memory.vertical_ratio,
            'created_at': memory.created_at.isoformat(),
            'updated_at': memory.updated_at.isoformat(),
        }

        deletion = MemoryDeletionRecord(
            memory_id=memory.id,
            session_id=session_id,
            snapshot_json=json.dumps(snapshot),
            expires_at=datetime.now(UTC) + timedelta(seconds=UNDO_WINDOW_SECONDS),
        )

        self.session.add(deletion)
        self.session.delete(memory)
        self.session.commit()
        self.session.refresh(deletion)
        return deletion

    def undo_delete(self, session_id: str, deletion_id: str) -> Memory | None:
        record = self.session.get(MemoryDeletionRecord, deletion_id)
        if not record or record.session_id != session_id:
            return None

        expires_at = record.expires_at
        if expires_at.tzinfo is None:
            now = datetime.now(UTC).replace(tzinfo=None)
        else:
            now = datetime.now(UTC)
        if now > expires_at:
            return None

        snapshot = json.loads(record.snapshot_json)
        memory = Memory(
            id=snapshot['id'],
            session_id=snapshot['session_id'],
            anchor_type=AnchorType(snapshot['anchor_type']),
            timestamp=datetime.fromisoformat(snapshot['timestamp']) if snapshot['timestamp'] else None,
            range_start=datetime.fromisoformat(snapshot['range_start']) if snapshot['range_start'] else None,
            range_end=datetime.fromisoformat(snapshot['range_end']) if snapshot['range_end'] else None,
            title=snapshot['title'],
            description=snapshot['description'],
            tags_json=snapshot.get('tags_json', '[]'),
            vertical_ratio=snapshot.get('vertical_ratio', 0.3),
            created_at=datetime.fromisoformat(snapshot['created_at']),
            updated_at=datetime.now(UTC),
        )
        memory.ensure_valid_anchor()

        self.session.add(memory)
        self.session.delete(record)
        self.session.commit()
        self.session.refresh(memory)
        return memory
