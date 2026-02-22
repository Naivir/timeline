from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from sqlmodel import Field, SQLModel


class Theme(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    session_id: str = Field(index=True)
    start_time: datetime
    end_time: datetime
    title: str
    description: str | None = None
    tags_json: str = Field(default='[]', nullable=False)
    color: str = Field(default='#3b82f6')
    opacity: float = Field(default=0.25)
    priority: int = Field(default=100)
    height_px: float = Field(default=64)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

    def ensure_valid(self) -> None:
        if self.end_time <= self.start_time:
            raise ValueError('end_time must be greater than start_time')
        if self.priority < 0 or self.priority > 1000:
            raise ValueError('priority must be in [0, 1000]')
        if self.opacity < 0.05 or self.opacity > 1:
            raise ValueError('opacity must be in [0.05, 1]')
        if self.height_px < 24 or self.height_px > 600:
            raise ValueError('height_px must be in [24, 600]')

