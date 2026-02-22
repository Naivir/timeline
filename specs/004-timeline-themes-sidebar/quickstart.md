# Quickstart: Timeline Themes, Sidebar, and Hover UX

## Prerequisites

- Repository root: `/Users/brianandres/Documents/Timeline`
- Backend dependencies installed (`uv sync` in `backend/`)
- Frontend dependencies installed (`npm install` in `frontend/`)

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

Open the app at the URL printed by Vite (typically `http://127.0.0.1:5173`).

## 3. Verification Commands

### Backend

```bash
cd /Users/brianandres/Documents/Timeline/backend
uv run pytest
```

### Frontend unit

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test
```

### Browser integration

```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e
```

## 4. Feature Verification Checklist

1. Hover a memory marker and verify tooltip appears quickly (<=150 ms) with title and short snippet.
2. Trigger delete/discard and verify compact in-app confirm popup (not browser-native dialog).
3. Open top-right sidebar and verify `New Memory`, `New Theme`, and disabled `New Songs` placeholder are visible.
4. Arm `New Theme`, drag above timeline to create a range, save with color/opacity/priority/title/tags/description.
5. Create overlapping themes and verify stacking by priority, then by creation recency on ties.
6. Resize theme horizontal edges (time span) and vertical edge (height), verifying bottom remains flush to timeline axis.
7. Verify ticks/labels and memory markers/connector lines remain visible above themes.
8. Open `Actions` and toggle `Resize`; verify resize mode also activates while holding `Shift` and exits immediately when `Shift` is released.
9. In resize mode, verify memory drag updates both horizontal anchor and vertical position; verify theme top/side edge drags resize height/span.
10. Trigger memory/theme delete and cancel-new flows and verify standalone centered confirm modal appears over details view.
11. In resize mode, verify theme top-corner drag can adjust height and span in one gesture.
12. In resize mode, verify memory marker visibly tracks the cursor during drag, and hover tooltips/titles are suppressed for memories/themes.

## 5. Mandatory Screenshot Sanity Loop

For each changed screen/popup in this feature:

1. Capture screenshot with Playwright.
2. Manually review the screenshot for layout/interaction quality.
3. If a defect is found, write/extend an automated test that fails for that defect.
4. Implement fix.
5. Re-run tests.
6. Capture and review updated screenshot.
7. Repeat until both tests and visual review pass.
