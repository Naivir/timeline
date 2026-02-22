from __future__ import annotations


def test_delete_contract_is_final_without_undo_payload(client) -> None:
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
    assert deleted.status_code == 204
    assert deleted.text == ''
