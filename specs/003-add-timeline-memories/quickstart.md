# Quickstart: Timeline Memory Interactions

## Prerequisites
- Python 3.13+
- Node.js 22+
- `uv`
- npm

## 1. Install dependencies

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv sync

cd /Users/brianandres/Documents/Timeline/frontend
npm install
npx playwright install chromium
```

## 2. Start backend (with DB persistence)

```bash
cd /Users/brianandres/Documents/Timeline/backend
UV_CACHE_DIR=../.uv-cache uv run uvicorn src.main:app --host 127.0.0.1 --port 8000
```

## 3. Start frontend

```bash
cd /Users/brianandres/Documents/Timeline/frontend
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173`.

## 4. Run verification

Backend API/domain tests:

```bash
cd /Users/brianandres/Documents/Timeline/backend
UV_CACHE_DIR=../.uv-cache uv run pytest
```

Frontend unit tests:

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test -- tests/memories/*.test.ts
```

Browser integration tests (live frontend + backend):

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e -- tests/memories/*.spec.ts
```

Pan/zoom + memory interaction regression:

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e -- tests/memories/timeline-gesture-independence.spec.ts
```

Screenshot sanity pass (one screenshot per key screen/popup):

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e -- tests/memories/ui-sanity-screens.spec.ts
```

Screenshot artifacts are written under `frontend/test-results/` in the
Playwright output directory for the run. Review all generated PNGs after each
UI change.

Required UI verification loop:
1. Capture screenshots for each changed screen/popup.
2. Manually inspect and record visible defects.
3. Add/adjust automated tests that fail for each defect.
4. Implement fixes and rerun tests.
5. Re-capture and re-review screenshots.
6. Repeat until both visual review and tests pass.

## 5. Manual validation checklist

1. Create memory from header `New Memory` and from timeline click.
2. Verify created memory appears aligned with timeline mapping and opens details.
3. Drag point memory marker and verify timestamp/position update continuously.
4. Convert memory to range and verify drag body/handles update anchors correctly.
5. Delete selected memory and verify undo restores it.
6. Pan/zoom timeline with memory overlays and verify timeline interactions remain intact.
7. Reload session and verify memory data is served from backend DB state.
8. Delete from details and verify undo restores the memory from undo toast.
9. Verify `Tags` and human-friendly `Timestamp` appear in details footer.
10. Review screenshot artifacts for base timeline, placement mode, memory placed, create-edit popup, inspect popup, edit popup, delete toast, and undo restored.
