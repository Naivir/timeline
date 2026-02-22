from __future__ import annotations


def test_patch_theme_contract(client, sample_theme_payload) -> None:
    created = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert created.status_code == 201
    theme_id = created.json()['id']

    patched = client.patch(
        f'/api/v1/sessions/test-session/themes/{theme_id}',
        json={'title': 'Renamed theme', 'priority': 990, 'opacity': 0.6},
    )
    assert patched.status_code == 200
    body = patched.json()
    assert body['id'] == theme_id
    assert body['title'] == 'Renamed theme'
    assert body['priority'] == 990
    assert body['opacity'] == 0.6


def test_delete_theme_contract(client, sample_theme_payload) -> None:
    created = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert created.status_code == 201
    theme_id = created.json()['id']

    deleted = client.delete(f'/api/v1/sessions/test-session/themes/{theme_id}')
    assert deleted.status_code == 204
    assert deleted.content == b''

    listed = client.get('/api/v1/sessions/test-session/themes')
    assert listed.status_code == 200
    assert listed.json()['themes'] == []
