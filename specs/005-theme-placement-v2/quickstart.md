# Quickstart: Theme Placement v2

## Prerequisites

- Repository root: `/Users/brianandres/Documents/Timeline`
- Backend dependencies installed in `/Users/brianandres/Documents/Timeline/backend`
- Frontend dependencies installed in `/Users/brianandres/Documents/Timeline/frontend`

## 1. Start Backend

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv sync
uv run uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

## 2. Start Frontend

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm install
npm run dev
```

Open the app at the Vite URL (typically `http://127.0.0.1:5173`).

## 3. Test-First Verification Commands

Run in this order during implementation (red -> green):

### Backend contracts/integration

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv run pytest tests/contract/test_themes_contract.py tests/contract/test_themes_patch_delete_contract.py tests/integration/test_theme_db_schema_migration.py tests/integration/test_theme_overlap_ordering.py
```

### Frontend unit

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test -- tests/themes tests/timeline
```

### Browser integration

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e -- tests/themes
```

## 4. Functional Verification Checklist

1. Enter New Theme mode; drag downward and verify initial pointer is top-left anchor and right edge is set by release.
2. Enter New Theme mode; drag upward and verify initial pointer is bottom-left anchor and right edge is set by release.
3. Verify create preview updates continuously while dragging and snaps to 4px vertical increments.
4. Place a second theme above/below an existing theme in the same time slice and verify both remain independently positioned.
5. Resize top edge and bottom edge independently; verify visible result snaps to 4px vertical grid each time.
6. Verify save/edit operations after resize never fail due to decimal geometry values.
7. Verify timeline time-to-x mapping behavior remains unchanged relative to pre-feature behavior.

## 5. Mandatory Screenshot Sanity Loop (Required)

For every changed screen or popup state in this feature:

1. Capture a screenshot from automated browser flow.
2. Manually inspect the screenshot for visual/interaction defects.
3. If any defect exists, write or update a failing automated test for that defect first.
4. Implement fix.
5. Re-run tests.
6. Capture a new screenshot and re-review.
7. Repeat until both tests and screenshot review pass.

Minimum screenshot set for this feature:
- Theme placement mode armed
- Downward drag preview
- Upward drag preview
- Floating stacked themes in same time slice
- Top-edge resize state
- Bottom-edge resize state
- Post-save theme details state
- Full-title in-block state
- Abbreviated-title fallback state
- Tooltip-only fallback state (no abbreviated title)

## 6. Verification Results (2026-02-22)

- Backend: `uv run pytest` in `/Users/brianandres/Documents/Timeline/backend` -> 26 passed.
- Frontend unit: `npm run test` in `/Users/brianandres/Documents/Timeline/frontend` -> 22 files, 39 tests passed.
- Frontend e2e: `npm run test:e2e` in `/Users/brianandres/Documents/Timeline/frontend` -> 32 passed.
- Screenshot artifacts captured under `/Users/brianandres/Documents/Timeline/frontend/test-results/screenshots/`:
  - `theme-placement-armed.png`
  - `theme-resize-mode.png`
  - `theme-resize-corner-move.png`
  - `theme-title-fallbacks.png`

## 7. Regression Notes (2026-02-22)

- Missed defect 1: theme create could fail when pointer-up occurred after dragging outside the surface.
  - Cause: create flow depended on in-surface pointer-up only.
  - Fix: pointer capture/release added in `frontend/src/components/themes/theme-layer.tsx`.
  - Guard test: `frontend/tests/themes/theme-create-drag-anchors.spec.ts` includes off-surface release case.
- Missed defect 2: downward drag could shift the anchor top edge before height threshold.
  - Cause: min-height normalization moved `topPx` during downward drag.
  - Fix: direction-aware normalization keeps first click stable in `frontend/src/services/themes/theme-geometry.ts`.
  - Guard test: `frontend/tests/themes/theme-placement-engine.test.ts` enforces stable top anchor.

## 8. New Requirements Verification (2026-02-22)

- Backend theme contract/integration subset:
  - Command: `uv run pytest tests/contract/test_themes_contract.py tests/contract/test_themes_patch_delete_contract.py tests/integration/test_theme_geometry_roundtrip.py -q`
  - Result: 6 passed
- Frontend unit subset (title-fit + abbreviated-title logic):
  - Command: `npm run test -- tests/themes/theme-placement-consistency.test.ts tests/themes/theme-resize-edges.test.ts tests/themes/theme-layer-order.test.ts`
  - Result: 3 files passed, 11 tests passed
- Frontend browser subset (title behavior + screenshots):
  - Command: `npm run test:e2e -- tests/themes/theme-placement-consistency.spec.ts tests/themes/theme-resize-screens.spec.ts`
  - Result: 4 passed
- Screenshot sanity artifacts reviewed:
  - `theme-resize-mode.png`
  - `theme-resize-corner-move.png`
  - `theme-title-fallbacks.png`
