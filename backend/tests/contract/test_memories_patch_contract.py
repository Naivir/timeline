from __future__ import annotations


def test_patch_memory_updates_metadata_and_anchor(client) -> None:
    create_response = client.post(
        '/api/v1/sessions/patch-session/memories',
        json={
            'anchor': {'type': 'point', 'timestamp': '2026-02-22T00:00:00Z'},
            'title': 'Initial memory',
            'description': 'initial',
            'tags': ['note'],
            'verticalRatio': 0.2,
        },
    )
    assert create_response.status_code == 201
    created = create_response.json()

    patch_response = client.patch(
        f"/api/v1/sessions/patch-session/memories/{created['id']}",
        json={
            'anchor': {
                'type': 'range',
                'start': '2026-02-23T00:00:00Z',
                'end': '2026-02-24T00:00:00Z',
            },
            'title': 'Updated memory',
            'description': 'updated',
            'tags': ['media'],
            'verticalRatio': 0.65,
        },
    )
    assert patch_response.status_code == 200

    patched = patch_response.json()
    assert patched['title'] == 'Updated memory'
    assert patched['description'] == 'updated'
    assert patched['tags'] == ['media']
    assert patched['anchor']['type'] == 'range'
    assert patched['verticalRatio'] == 0.65
