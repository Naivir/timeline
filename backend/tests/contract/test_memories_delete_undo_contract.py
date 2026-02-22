from __future__ import annotations


def test_delete_and_undo_contract(client) -> None:
    create = client.post(
        '/api/v1/sessions/test-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-22T00:00:00Z'},
            'title': 'Delete me',
            'tags': ['note'],
        },
    )
    assert create.status_code == 201
    memory_id = create.json()['id']

    deleted = client.delete(f'/api/v1/sessions/test-session/memories/{memory_id}')
    assert deleted.status_code == 200
    deletion_payload = deleted.json()
    assert 'deletionId' in deletion_payload
    assert 'undoExpiresAt' in deletion_payload

    restored = client.post(
        f"/api/v1/sessions/test-session/memories/deletions/{deletion_payload['deletionId']}/undo"
    )
    assert restored.status_code == 200
    restored_payload = restored.json()
    assert restored_payload['id'] == memory_id
    assert restored_payload['title'] == 'Delete me'
    assert restored_payload['tags'] == ['note']
