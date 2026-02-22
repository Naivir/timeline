from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from sqlmodel import Field, SQLModel


class MemoryDeletionRecord(SQLModel, table=True):
    deletion_id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    memory_id: str = Field(index=True)
    session_id: str = Field(index=True)
    snapshot_json: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
