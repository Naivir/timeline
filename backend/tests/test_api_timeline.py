import os
import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.main import app  # noqa: E402


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    payload = response.json()
    assert payload['status'] == 'ok'
    assert 'message' in payload


def test_timeline_endpoint_success() -> None:
    response = client.get('/api/v1/timeline')
    assert response.status_code == 200
    payload = response.json()

    assert payload['baseline']['orientation'] == 'horizontal'
    assert isinstance(payload['eventPlaceholders'], list)
    assert 'requestId' in payload['meta']


def test_timeline_endpoint_service_unavailable() -> None:
    os.environ['TIMELINE_FORCE_UNAVAILABLE'] = '1'
    try:
        response = client.get('/api/v1/timeline')
    finally:
        os.environ.pop('TIMELINE_FORCE_UNAVAILABLE', None)

    assert response.status_code == 503
    payload = response.json()
    assert payload['code'] == 'SERVICE_UNAVAILABLE'


def test_timeline_endpoint_cors_allows_local_frontend_origin() -> None:
    response = client.options(
        '/api/v1/timeline',
        headers={
            'Origin': 'http://127.0.0.1:4173',
            'Access-Control-Request-Method': 'GET',
        },
    )

    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == 'http://127.0.0.1:4173'
