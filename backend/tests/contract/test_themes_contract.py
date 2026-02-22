from __future__ import annotations


def test_list_themes_empty(client) -> None:
    response = client.get('/api/v1/sessions/test-session/themes')
    assert response.status_code == 200
    assert response.json() == {'sessionId': 'test-session', 'themes': []}


def test_create_and_list_theme_contract(client, sample_theme_payload) -> None:
    created = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert created.status_code == 201
    body = created.json()
    assert body['title'] == sample_theme_payload['title']
    assert body['priority'] == sample_theme_payload['priority']

    listed = client.get('/api/v1/sessions/test-session/themes')
    assert listed.status_code == 200
    payload = listed.json()
    assert payload['sessionId'] == 'test-session'
    assert len(payload['themes']) == 1
    assert payload['themes'][0]['id'] == body['id']

