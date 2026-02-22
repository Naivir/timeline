from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class BaselineOrientation(str, Enum):
    HORIZONTAL = "horizontal"


class Timeline(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str = Field(min_length=1, max_length=120)
    startLabel: str
    endLabel: str
    createdAt: datetime
    updatedAt: datetime


class TimelineBaseline(BaseModel):
    model_config = ConfigDict(extra="forbid")

    orientation: BaselineOrientation = BaselineOrientation.HORIZONTAL
    positionPercent: float = Field(ge=0, le=100)
    thicknessPx: int = Field(ge=1, le=12)
    lengthPercent: float = Field(ge=10, le=100)


class TimelineEventStatus(str, Enum):
    EMPTY = "empty"
    RESERVED = "reserved"


class TimelineEventPlaceholder(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    timeLabel: str
    positionPercent: float = Field(ge=0, le=100)
    status: TimelineEventStatus = TimelineEventStatus.EMPTY
    metadata: dict[str, Any] | None = None


class TimelineMeta(BaseModel):
    model_config = ConfigDict(extra="forbid")

    requestId: str


class TimelineResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    timeline: Timeline
    baseline: TimelineBaseline
    eventPlaceholders: list[TimelineEventPlaceholder]
    meta: TimelineMeta


class ErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str
    message: str


def utc_now() -> datetime:
    return datetime.now(timezone.utc)
