# Verification Evidence: 004 Timeline Themes Sidebar

Date: 2026-02-22

## Automated Verification

- Backend suite:
  - Command: `cd backend && uv run pytest -q`
  - Result: pass (`23 passed`)
- Frontend unit suite:
  - Command: `cd frontend && npm run test -- --run`
  - Result: pass (`19 files, 33 tests passed`)
- Frontend e2e suite:
  - Command: `cd frontend && npm run test:e2e`
  - Result: pass (`23 passed`)

## Screenshot Sanity Loop

Memory flow screenshots captured and reviewed:

- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/01-base-screen.png`
- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/02-placement-mode.png`
- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/03-memory-placed.png`
- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/04-create-edit-popup.png`
- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/05-memory-inspect-popup.png`
- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/06-memory-edit-popup.png`
- `frontend/test-results/memories-ui-sanity-screens-23d35--timeline-and-memory-popups/07-delete-final.png`

Theme flow screenshots captured and reviewed:

- `frontend/test-results/themes-ui-sanity-screens-c-b0b06-for-theme-flows-and-sidebar/01-theme-base.png`
- `frontend/test-results/themes-ui-sanity-screens-c-b0b06-for-theme-flows-and-sidebar/02-actions-sidebar.png`
- `frontend/test-results/themes-ui-sanity-screens-c-b0b06-for-theme-flows-and-sidebar/03-theme-create-popup.png`
- `frontend/test-results/themes-ui-sanity-screens-c-b0b06-for-theme-flows-and-sidebar/04-theme-created.png`
- `frontend/test-results/themes-ui-sanity-screens-c-b0b06-for-theme-flows-and-sidebar/05-theme-details.png`
- `frontend/test-results/themes-ui-sanity-screens-c-b0b06-for-theme-flows-and-sidebar/06-theme-delete-confirm.png`

## Notable Fixes During Iteration

- Converted memory placement tests from `memory-layer` clicks to `timeline-surface` clicks after overlay event-layering refactor.
- Made theme interaction layer pointer-events mode-aware so memory placement and theme selection no longer block each other.
- Centered timeline axis relative to viewport by moving header to fixed overlay layout.
- Updated vertical wheel zoom filtering and sensitivity to reduce post-gesture momentum while preserving horizontal inertial zoom behavior.
- Added a global `Resize` sidebar control and Shift-hold resize behavior; verified with unit/e2e tests and screenshot review.
- Replaced inline confirmation sections with standalone centered confirm modals for memory/theme delete and discard flows.
- Added continuous memory drag updates in resize mode so marker movement is visible during pointer movement.
- Added theme corner-resize affordances (top-left/top-right) and verified corner drag interaction path.
- Added resize-mode regression tests:
  - `frontend/tests/memories/memory-resize-mode-move.spec.ts`
  - `frontend/tests/themes/theme-resize-mode.spec.ts`
