from __future__ import annotations

import os
from uuid import uuid4

from src.models.timeline import (
    Timeline,
    TimelineBaseline,
    TimelineEventPlaceholder,
    TimelineMeta,
    TimelineResponse,
    utc_now,
)


class TimelineServiceUnavailableError(Exception):
    pass


class TimelineService:
    """Provides read-only timeline payloads for the MVP phase."""

    def get_timeline(self) -> TimelineResponse:
        if os.getenv('TIMELINE_FORCE_UNAVAILABLE') == '1':
            raise TimelineServiceUnavailableError('Timeline service is temporarily unavailable.')

        now = utc_now()
        timeline = Timeline(
            id='timeline-main',
            title='My Timeline',
            startLabel='Past',
            endLabel='Future',
            createdAt=now,
            updatedAt=now,
        )
        baseline = TimelineBaseline(
            orientation='horizontal',
            positionPercent=50,
            thicknessPx=4,
            lengthPercent=92,
        )
        placeholders = [
            TimelineEventPlaceholder(id='p1', timeLabel='Chapter 1', positionPercent=20),
            TimelineEventPlaceholder(id='p2', timeLabel='Chapter 2', positionPercent=55),
            TimelineEventPlaceholder(id='p3', timeLabel='Chapter 3', positionPercent=80),
        ]
        return TimelineResponse(
            timeline=timeline,
            baseline=baseline,
            eventPlaceholders=placeholders,
            meta=TimelineMeta(requestId=str(uuid4())),
        )
