from __future__ import annotations


def test_theme_geometry_roundtrip_on_create_patch_list(client, sample_theme_payload) -> None:
    created = client.post(
        '/api/v1/sessions/test-session/themes',
        json={**sample_theme_payload, 'abbreviatedTitle': 'Trip'},
    )
    assert created.status_code == 201
    body = created.json()
    theme_id = body['id']

    patched = client.patch(
        f'/api/v1/sessions/test-session/themes/{theme_id}',
        json={'topPx': 128, 'bottomPx': 224},
    )
    assert patched.status_code == 200

    listed = client.get('/api/v1/sessions/test-session/themes')
    assert listed.status_code == 200
    theme = listed.json()['themes'][0]
    assert theme['topPx'] == 128
    assert theme['bottomPx'] == 224
    assert theme['abbreviatedTitle'] == 'Trip'


def test_theme_abbreviated_title_is_optional_without_autogeneration(client, sample_theme_payload) -> None:
    created = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert created.status_code == 201
    body = created.json()
    assert body['abbreviatedTitle'] is None
