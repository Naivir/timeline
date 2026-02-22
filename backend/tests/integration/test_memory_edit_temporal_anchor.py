from __future__ import annotations

from sqlmodel import Session

from src.db import engine
from src.models.memory import AnchorType, Memory


def test_patch_point_memory_updates_timestamp_and_vertical_ratio(client) -> None:
    create_response = client.post(
        '/api/v1/sessions/edit-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-20T10:15:00Z'},
            'title': 'Point memory',
            'verticalRatio': 0.35,
        },
    )
    assert create_response.status_code == 201
    memory_id = create_response.json()['id']

    patch_response = client.patch(
        f'/api/v1/sessions/edit-session/memories/{memory_id}',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-21T11:15:00Z'},
            'verticalRatio': 0.7,
        },
    )
    assert patch_response.status_code == 200
    payload = patch_response.json()
    assert payload['anchor']['timestamp'].startswith('2026-02-21T11:15:00')
    assert payload['verticalRatio'] == 0.7

    with Session(engine) as session:
        row = session.get(Memory, memory_id)
        assert row is not None
        assert row.anchor_type == AnchorType.POINT
        assert row.timestamp is not None
        assert row.timestamp.isoformat().startswith('2026-02-21T11:15:00')
        assert row.vertical_ratio == 0.7


def test_patch_memory_to_range_persists_start_end(client) -> None:
    create_response = client.post(
        '/api/v1/sessions/edit-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-20T10:15:00Z'},
            'title': 'Range candidate',
        },
    )
    assert create_response.status_code == 201
    memory_id = create_response.json()['id']

    patch_response = client.patch(
        f'/api/v1/sessions/edit-session/memories/{memory_id}',
        json={
            'anchor': {
                'type': 'range',
                'start': '2026-03-01T00:00:00Z',
                'end': '2026-03-05T00:00:00Z',
            },
            'verticalRatio': 0.55,
        },
    )
    assert patch_response.status_code == 200
    payload = patch_response.json()
    assert payload['anchor']['type'] == 'range'
    assert payload['anchor']['start'].startswith('2026-03-01T00:00:00')
    assert payload['anchor']['end'].startswith('2026-03-05T00:00:00')

    with Session(engine) as session:
        row = session.get(Memory, memory_id)
        assert row is not None
        assert row.anchor_type == AnchorType.RANGE
        assert row.range_start is not None
        assert row.range_end is not None
        assert row.range_start.isoformat().startswith('2026-03-01T00:00:00')
        assert row.range_end.isoformat().startswith('2026-03-05T00:00:00')
        assert row.vertical_ratio == 0.55

