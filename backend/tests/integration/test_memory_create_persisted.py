from __future__ import annotations

from sqlmodel import Session, select

from src.db import DB_PATH, engine
from src.models.memory import Memory


def test_create_memory_persists_to_db(client) -> None:
    response = client.post(
        '/api/v1/sessions/persist-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-20T10:15:00Z'},
            'title': 'Persisted memory',
        },
    )
    assert response.status_code == 201
    memory_id = response.json()['id']

    with Session(engine) as session:
        row = session.exec(select(Memory).where(Memory.id == memory_id)).first()
        assert row is not None
        assert row.title == 'Persisted memory'
        assert row.session_id == 'persist-session'

    assert DB_PATH.exists()
