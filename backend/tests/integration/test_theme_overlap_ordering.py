from __future__ import annotations


def _create_theme(client, title: str, priority: int) -> str:
    payload = {
        'startTime': '2026-01-01T00:00:00Z',
        'endTime': '2026-01-10T00:00:00Z',
        'title': title,
        'description': 'overlap check',
        'tags': ['theme'],
        'color': '#3b82f6',
        'opacity': 0.35,
        'priority': priority,
        'heightPx': 90,
    }
    created = client.post('/api/v1/sessions/timeline-main/themes', json=payload)
    assert created.status_code == 201
    return created.json()['id']


def test_list_order_is_priority_then_creation_recency(client) -> None:
    first_low = _create_theme(client, 'Low A', 10)
    second_low = _create_theme(client, 'Low B', 10)
    high = _create_theme(client, 'High', 900)

    listed = client.get('/api/v1/sessions/timeline-main/themes')
    assert listed.status_code == 200
    ids = [theme['id'] for theme in listed.json()['themes']]

    # Lower-priority themes render first; later-created tie appears after earlier.
    assert ids.index(first_low) < ids.index(second_low)
    assert ids.index(second_low) < ids.index(high)
