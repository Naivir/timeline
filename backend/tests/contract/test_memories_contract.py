from __future__ import annotations


def test_list_memories_empty(client) -> None:
    response = client.get('/api/v1/sessions/test-session/memories')
    assert response.status_code == 200
    payload = response.json()
    assert payload == {'memories': []}


def test_create_memory_and_list(client) -> None:
    create_response = client.post(
        '/api/v1/sessions/test-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-22T00:00:00Z'},
            'title': 'First memory',
            'description': 'hello',
            'tags': ['note'],
        },
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created['title'] == 'First memory'
    assert created['anchor']['type'] == 'point'

    list_response = client.get('/api/v1/sessions/test-session/memories')
    assert list_response.status_code == 200
    listed = list_response.json()['memories']
    assert len(listed) == 1
    assert listed[0]['id'] == created['id']


def test_create_then_delete_can_discard_new_memory(client) -> None:
    create_response = client.post(
        '/api/v1/sessions/test-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-22T00:00:00Z'},
            'title': 'Draft memory',
            'description': 'temporary',
            'tags': ['draft'],
        },
    )
    assert create_response.status_code == 201
    created = create_response.json()

    delete_response = client.delete(f"/api/v1/sessions/test-session/memories/{created['id']}")
    assert delete_response.status_code == 204
    assert delete_response.text == ''

    list_response = client.get('/api/v1/sessions/test-session/memories')
    assert list_response.status_code == 200
    assert list_response.json() == {'memories': []}
