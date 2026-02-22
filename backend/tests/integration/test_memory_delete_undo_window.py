from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlmodel import Session, select

from src.db import engine
from src.models.memory_deletion import MemoryDeletionRecord


def test_undo_window_expiration_returns_410(client) -> None:
    created = client.post(
        '/api/v1/sessions/test-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-22T00:00:00Z'},
            'title': 'Expire undo',
            'tags': ['note'],
        },
    )
    assert created.status_code == 201

    deleted = client.delete(f"/api/v1/sessions/test-session/memories/{created.json()['id']}")
    assert deleted.status_code == 200
    deletion_id = deleted.json()['deletionId']

    with Session(engine) as session:
        record = session.get(MemoryDeletionRecord, deletion_id)
        assert record is not None
        record.expires_at = datetime.now(UTC) - timedelta(seconds=1)
        session.add(record)
        session.commit()

    undo = client.post(f'/api/v1/sessions/test-session/memories/deletions/{deletion_id}/undo')
    assert undo.status_code == 410
