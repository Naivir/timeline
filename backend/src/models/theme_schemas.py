from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class ThemeCreateRequest(BaseModel):
    startTime: datetime
    endTime: datetime
    title: str
    description: str | None = None
    tags: list[str] = []
    color: str
    opacity: float
    priority: int
    heightPx: float

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('title must not be empty')
        return stripped


class ThemeUpdateRequest(BaseModel):
    startTime: datetime | None = None
    endTime: datetime | None = None
    title: str | None = None
    description: str | None = None
    tags: list[str] | None = None
    color: str | None = None
    opacity: float | None = None
    priority: int | None = None
    heightPx: float | None = None


class ThemeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sessionId: str
    startTime: datetime
    endTime: datetime
    title: str
    description: str | None
    tags: list[str]
    color: str
    opacity: float
    priority: int
    heightPx: float
    createdAt: datetime
    updatedAt: datetime


class ThemeListResponse(BaseModel):
    sessionId: str
    themes: list[ThemeResponse]

