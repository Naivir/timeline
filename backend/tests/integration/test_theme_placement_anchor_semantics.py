from __future__ import annotations


def test_create_theme_persists_geometry_fields(client, sample_theme_payload) -> None:
    response = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert response.status_code == 201
    body = response.json()
    assert body['topPx'] == sample_theme_payload['topPx']
    assert body['bottomPx'] == sample_theme_payload['bottomPx']
    assert body['bottomPx'] > body['topPx']
