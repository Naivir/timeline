from __future__ import annotations

from datetime import UTC, datetime
from enum import StrEnum
from typing import Optional
from uuid import uuid4

from sqlmodel import Field, SQLModel


class AnchorType(StrEnum):
    POINT = 'point'
    RANGE = 'range'


class TimelineSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)


class Memory(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    session_id: str = Field(index=True)
    anchor_type: AnchorType
    timestamp: Optional[datetime] = Field(default=None)
    range_start: Optional[datetime] = Field(default=None)
    range_end: Optional[datetime] = Field(default=None)
    title: str
    description: Optional[str] = None
    tags_json: str = Field(default='[]', nullable=False)
    vertical_ratio: float = Field(default=0.3, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC), nullable=False)

    def ensure_valid_anchor(self) -> None:
        if self.anchor_type == AnchorType.POINT:
            if self.timestamp is None:
                raise ValueError('timestamp is required for point anchor')
            self.range_start = None
            self.range_end = None
            return

        if self.range_start is None or self.range_end is None:
            raise ValueError('range_start and range_end are required for range anchor')
        if self.range_end < self.range_start:
            raise ValueError('range_end must be >= range_start')
        self.timestamp = None
