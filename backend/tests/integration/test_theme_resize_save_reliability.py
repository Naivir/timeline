from __future__ import annotations


def test_patch_theme_with_decimal_geometry_does_not_fail(client, sample_theme_payload) -> None:
    created = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert created.status_code == 201
    theme_id = created.json()['id']

    patched = client.patch(
        f'/api/v1/sessions/test-session/themes/{theme_id}',
        json={'topPx': 121.8, 'bottomPx': 215.1, 'title': 'Adjusted'},
    )
    assert patched.status_code == 200
    body = patched.json()
    assert body['title'] == 'Adjusted'
    assert body['bottomPx'] > body['topPx']


def test_patch_theme_rejects_inverted_vertical_bounds(client, sample_theme_payload) -> None:
    created = client.post('/api/v1/sessions/test-session/themes', json=sample_theme_payload)
    assert created.status_code == 201
    theme_id = created.json()['id']

    patched = client.patch(
        f'/api/v1/sessions/test-session/themes/{theme_id}',
        json={'topPx': 220, 'bottomPx': 120},
    )
    assert patched.status_code == 422
