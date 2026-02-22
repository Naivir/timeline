from __future__ import annotations

def test_cancel_discard_equivalent_delete_removes_created_memory(client) -> None:
    created_response = client.post(
        '/api/v1/sessions/timeline-main/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-22T00:00:00Z'},
            'title': 'Unsaved memory',
            'description': 'temporary',
            'tags': ['draft'],
            'verticalRatio': 0.4,
        },
    )
    assert created_response.status_code == 201
    created_id = created_response.json()['id']

    before = client.get('/api/v1/sessions/timeline-main/memories')
    assert before.status_code == 200
    assert any(memory['id'] == created_id for memory in before.json()['memories'])

    deleted = client.delete(f'/api/v1/sessions/timeline-main/memories/{created_id}')
    assert deleted.status_code == 204

    after = client.get('/api/v1/sessions/timeline-main/memories')
    assert after.status_code == 200
    assert all(memory['id'] != created_id for memory in after.json()['memories'])
