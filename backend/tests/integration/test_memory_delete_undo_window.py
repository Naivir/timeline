from __future__ import annotations


def test_memory_delete_is_final_and_record_is_absent(client) -> None:
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
    assert deleted.status_code == 204

    listed = client.get('/api/v1/sessions/test-session/memories')
    assert listed.status_code == 200
    assert listed.json()['memories'] == []
