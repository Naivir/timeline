from __future__ import annotations


def test_list_themes_empty(client) -> None:
    response = client.get('/api/v1/sessions/test-session/themes')
    assert response.status_code == 200
    assert response.json() == {'sessionId': 'test-session', 'themes': []}


def test_create_and_list_theme_contract(client, sample_theme_payload) -> None:
    payload = {**sample_theme_payload, 'abbreviatedTitle': 'Trip'}
    created = client.post('/api/v1/sessions/test-session/themes', json=payload)
    assert created.status_code == 201
    body = created.json()
    assert body['title'] == payload['title']
    assert body['abbreviatedTitle'] == 'Trip'
    assert body['priority'] == payload['priority']
    assert body['topPx'] == payload['topPx']
    assert body['bottomPx'] == payload['bottomPx']

    listed = client.get('/api/v1/sessions/test-session/themes')
    assert listed.status_code == 200
    payload = listed.json()
    assert payload['sessionId'] == 'test-session'
    assert len(payload['themes']) == 1
    assert payload['themes'][0]['id'] == body['id']
    assert payload['themes'][0]['abbreviatedTitle'] == 'Trip'
    assert payload['themes'][0]['bottomPx'] > payload['themes'][0]['topPx']
