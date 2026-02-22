from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class ServiceState(str, Enum):
    OK = "ok"
    DEGRADED = "degraded"


class ServiceStatus(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: ServiceState
    message: str
    checkedAt: datetime
