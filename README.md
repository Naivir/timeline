# Timeline Local Setup

This project runs a FastAPI backend and a React frontend.

## Prerequisites

- `uv` (Python package/environment manager)
- Python 3.12+
- Node.js 22+
- npm 10+

## 1. Install dependencies

Backend:

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv sync --extra dev
```

Frontend:

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm install
npx playwright install chromium
```

## 2. Start the backend

In Terminal A:

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv run uvicorn src.main:app --reload --port 8000
```

Backend URLs:

- Health: `http://localhost:8000/api/v1/health`
- Timeline: `http://localhost:8000/api/v1/timeline`

## 3. Start the frontend

In Terminal B:

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## 4. Run tests

Backend tests:

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv run pytest
```

Frontend unit tests:

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test
```

Frontend e2e tests:

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e
```

## 5. Simulate backend outage (optional)

In the backend terminal, set:

```bash
export TIMELINE_FORCE_UNAVAILABLE=1
```

Refresh the frontend and confirm retry UI appears.

Then unset:

```bash
unset TIMELINE_FORCE_UNAVAILABLE
```
