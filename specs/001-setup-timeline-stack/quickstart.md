# Quickstart: Timeline Foundation

## Prerequisites
- Python 3.12+
- Node.js 22+
- npm 10+

## 1. Backend setup
```bash
cd /Users/brianandres/Documents/Timeline/backend
uv sync --extra dev
```

## 2. Frontend setup
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm install
```

## 3. Run services
Terminal A (backend):
```bash
cd /Users/brianandres/Documents/Timeline/backend
uv run uvicorn src.main:app --reload --port 8000
```

Terminal B (frontend):
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run dev
```

## 4. Verify behavior (constitution-aligned checks)
- Baseline timeline renders:
```bash
curl -s http://localhost:8000/api/v1/timeline | jq '.baseline.orientation'
```
Expected: `"horizontal"`

- Service health endpoint:
```bash
curl -s http://localhost:8000/api/v1/health | jq '.status'
```
Expected: `"ok"`

- Backend tests:
```bash
cd /Users/brianandres/Documents/Timeline/backend
uv run pytest
```

- Frontend tests:
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test
```

- End-to-end smoke test (if configured):
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e
```

## 5. Failure-state check
1. In backend terminal, force unavailability:
   ```bash
   export TIMELINE_FORCE_UNAVAILABLE=1
   ```
2. Refresh frontend timeline page.
3. Confirm UI shows readable retry-oriented error state and remains interactive.
4. Remove forced error and retry:
   ```bash
   unset TIMELINE_FORCE_UNAVAILABLE
   ```
