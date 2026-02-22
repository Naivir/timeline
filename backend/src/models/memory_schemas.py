from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, field_validator


class PointAnchor(BaseModel):
    type: Literal['point']
    timestamp: datetime


class RangeAnchor(BaseModel):
    type: Literal['range']
    start: datetime
    end: datetime

    @field_validator('end')
    @classmethod
    def validate_bounds(cls, value: datetime, info):
        start = info.data.get('start')
        if start and value < start:
            raise ValueError('end must be >= start')
        return value


TemporalAnchor = PointAnchor | RangeAnchor


class MemoryCreateRequest(BaseModel):
    anchor: TemporalAnchor
    title: str
    description: Optional[str] = None
    tags: list[str] = []
    verticalRatio: float = 0.3

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('title must not be empty')
        return stripped

    @field_validator('verticalRatio')
    @classmethod
    def vertical_ratio_in_bounds(cls, value: float) -> float:
        if value < 0 or value > 1:
            raise ValueError('verticalRatio must be in [0, 1]')
        return value


class MemoryUpdateRequest(BaseModel):
    anchor: Optional[TemporalAnchor] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    verticalRatio: Optional[float] = None

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError('title must not be empty')
        return stripped

    @field_validator('verticalRatio')
    @classmethod
    def vertical_ratio_in_bounds(cls, value: Optional[float]) -> Optional[float]:
        if value is None:
            return value
        if value < 0 or value > 1:
            raise ValueError('verticalRatio must be in [0, 1]')
        return value


class MemoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sessionId: str
    anchor: TemporalAnchor
    title: str
    description: Optional[str]
    tags: list[str]
    verticalRatio: float
    createdAt: datetime
    updatedAt: datetime


class MemoryListResponse(BaseModel):
    memories: list[MemoryResponse]
