from __future__ import annotations

import os
from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault('TIMELINE_DB_PATH', str(ROOT / 'test-timeline.db'))

from src.db import engine, init_db
from src.main import app


@pytest.fixture(autouse=True)
def reset_db() -> None:
    SQLModel.metadata.drop_all(engine)
    init_db()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
