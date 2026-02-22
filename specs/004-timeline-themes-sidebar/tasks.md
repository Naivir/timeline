# Tasks: Timeline Themes, Sidebar, Resize Mode, and Zoom Behavior

**Input**: Design documents from `/specs/004-timeline-themes-sidebar/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/themes-api.yaml`, `quickstart.md`

**Tests**: Test tasks are mandatory for each user story. Tests must be written first, fail first, and pass before story completion.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align dependencies, fixtures, and verification docs for updated scope.

- [X] T001 Update backend dependency lock alignment in `backend/pyproject.toml` and `backend/uv.lock`
- [X] T002 Update frontend dependency lock alignment in `frontend/package.json` and `frontend/package-lock.json`
- [X] T003 [P] Extend backend test fixtures for theme + resize mode payload variants in `backend/tests/conftest.py`
- [X] T004 [P] Extend frontend test helpers for sidebar mode and resize activation flows in `frontend/tests/memories/test-helpers.ts`
- [X] T005 Update verification workflow notes for dedicated delete modal and resize mode in `specs/004-timeline-themes-sidebar/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build cross-story foundation for themes, resize mode state, and interaction contracts.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Ensure Theme schema registration and DB bootstrapping in `backend/src/models/theme.py` and `backend/src/db.py`
- [X] T007 [P] Update Theme API schema models for resize/metadata constraints in `backend/src/models/theme_schemas.py`
- [X] T008 [P] Implement Theme repository ordering and patch primitives in `backend/src/repositories/theme_repository.py`
- [X] T009 Implement Theme service orchestration and validation pass-through in `backend/src/services/theme_service.py`
- [X] T010 Register/verify Theme API routes in `backend/src/api/themes.py` and `backend/src/api/__init__.py`
- [X] T011 [P] Add/refresh foundational Theme contract coverage in `backend/tests/contract/test_themes_contract.py`
- [X] T012 [P] Add/refresh foundational Theme schema migration coverage in `backend/tests/integration/test_theme_db_schema_migration.py`
- [X] T013 Define frontend resize mode contracts and state flags in `frontend/src/services/themes/theme-types.ts` and `frontend/src/services/memories/memory-types.ts`
- [X] T014 [P] Update frontend theme API mappings and patch payload handling in `frontend/src/services/themes/theme-api.ts`
- [X] T015 [P] Update frontend theme layering utilities for deterministic topmost targeting in `frontend/src/services/themes/theme-layer-order.ts`
- [X] T016 [P] Update theme geometry utilities for edge-activated resize semantics in `frontend/src/services/themes/theme-geometry.ts`
- [X] T017 Add shared resize mode state plumbing in `frontend/src/pages/timeline-page.tsx` and `frontend/src/components/layout/action-sidebar.tsx`

**Checkpoint**: Foundation complete; all user stories can proceed.

---

## Phase 3: User Story 1 - Memory Hover, Dedicated Delete Modal, and Memory Resize Move (Priority: P1) 🎯 MVP

**Goal**: Deliver fast memory hover preview, dedicated delete/discard confirmation modal, and resize-mode memory reposition behavior.

**Independent Test**: Hover preview appears <=150 ms; delete/discard uses separate modal; memory in resize mode can move vertically/horizontally by click-drag.

### Tests for User Story 1 (MANDATORY)

- [X] T018 [P] [US1] Add frontend unit test for memory hover delay/snippet behavior in `frontend/tests/memories/memory-hover-tooltip.test.tsx`
- [X] T019 [P] [US1] Add frontend unit test for memory resize-mode click/drag move semantics in `frontend/tests/memories/memory-drag-edit.test.ts`
- [X] T020 [P] [US1] Add frontend e2e test for dedicated memory delete modal overlay behavior in `frontend/tests/memories/memory-delete-confirm-only.spec.ts`
- [X] T021 [P] [US1] Add frontend e2e test for cancel-new-memory dedicated modal discard behavior in `frontend/tests/memories/create-cancel-discard.spec.ts`
- [X] T022 [P] [US1] Add backend contract test for final memory delete response in `backend/tests/contract/test_memories_delete_contract.py`
- [X] T023 [P] [US1] Add backend integration test for final memory delete and no-undo semantics in `backend/tests/integration/test_memory_delete_final.py`

### Implementation for User Story 1

- [X] T024 [US1] Implement memory hover preview timing/snippet utility behavior in `frontend/src/services/memories/memory-hover.ts`
- [X] T025 [US1] Wire hover preview rendering and timers in `frontend/src/components/memories/memory-layer.tsx`
- [X] T026 [US1] Implement memory resize-mode drag behavior with vertical+horizontal updates in `frontend/src/components/memories/memory-marker.tsx` and `frontend/src/components/memories/memory-layer.tsx`
- [X] T027 [US1] Implement dedicated memory confirmation modal component layer in `frontend/src/components/memories/memory-confirm-modal.tsx`
- [X] T028 [US1] Integrate dedicated memory confirmation modal flow in `frontend/src/components/memories/memory-details-panel.tsx` and `frontend/src/pages/timeline-page.tsx`
- [X] T029 [US1] Finalize backend final-delete route/service behavior in `backend/src/api/memories.py`, `backend/src/services/memory_service.py`, and `backend/src/repositories/memory_repository.py`
- [X] T030 [US1] Update memory delete schema contracts in `backend/src/models/memory_schemas.py` and `frontend/src/services/memories/memory-api.ts`
- [X] T031 [US1] Update memory interaction styling for resize mode affordances in `frontend/src/index.css`

**Checkpoint**: US1 complete and independently testable.

---

## Phase 4: User Story 2 - Theme Lifecycle, Edge-Activated Resize, and Dedicated Delete Modal (Priority: P1)

**Goal**: Deliver full theme create/select/edit/delete flows, resize mode activation (Shift or sidebar toggle), edge-activated theme resizing, and dedicated delete modal behavior.

**Independent Test**: User can create a theme via drag above axis, edit it, resize span/height in resize mode, and delete via standalone confirm modal.

### Tests for User Story 2 (MANDATORY)

- [X] T032 [P] [US2] Add backend contract tests for theme patch/delete semantics in `backend/tests/contract/test_themes_patch_delete_contract.py`
- [X] T033 [P] [US2] Add backend integration test for overlap order and topmost selection consistency in `backend/tests/integration/test_theme_overlap_ordering.py`
- [X] T034 [P] [US2] Add frontend unit test for minimum-range auto expansion in `frontend/tests/themes/theme-min-range.test.ts`
- [X] T035 [P] [US2] Add frontend unit test for theme ordering/topmost selection in `frontend/tests/themes/theme-layer-order.test.ts`
- [X] T036 [P] [US2] Add frontend e2e test for drag-create and edit popup open in `frontend/tests/themes/theme-create-edit.spec.ts`
- [X] T037 [P] [US2] Add frontend e2e test for overlap click selecting topmost theme in `frontend/tests/themes/theme-overlap-selection.spec.ts`
- [X] T038 [P] [US2] Add frontend e2e test for dedicated theme delete modal flow in `frontend/tests/themes/theme-delete-confirm-only.spec.ts`

### Implementation for User Story 2

- [X] T039 [US2] Finalize theme repository create/list/update/delete query paths in `backend/src/repositories/theme_repository.py`
- [X] T040 [US2] Finalize theme service validation and mapping logic in `backend/src/services/theme_service.py`
- [X] T041 [US2] Finalize theme API handlers and error responses in `backend/src/api/themes.py`
- [X] T042 [US2] Implement theme create mode drag-selection in `frontend/src/components/themes/theme-layer.tsx`
- [X] T043 [US2] Implement theme block rendering with top-edge and side-edge affordances in `frontend/src/components/themes/theme-block.tsx`
- [X] T044 [US2] Implement edge-hover cursor behavior gated by resize mode in `frontend/src/components/themes/theme-layer.tsx` and `frontend/src/index.css`
- [X] T045 [US2] Implement dedicated theme confirmation modal component layer in `frontend/src/components/themes/theme-confirm-modal.tsx`
- [X] T046 [US2] Integrate theme details/edit + dedicated delete modal behavior in `frontend/src/components/themes/theme-details-panel.tsx`
- [X] T047 [US2] Integrate theme state lifecycle (draft/select/edit/delete) in `frontend/src/pages/timeline-page.tsx`
- [X] T048 [US2] Wire theme API DTO mappings and patch calls in `frontend/src/services/themes/theme-api.ts` and `frontend/src/services/themes/theme-types.ts`
- [X] T049 [US2] Enforce theme geometry constraints (min duration, flush axis, height bounds) in `frontend/src/services/themes/theme-geometry.ts`
- [X] T050 [US2] Enforce theme overlap ordering and click target resolution in `frontend/src/services/themes/theme-layer-order.ts` and `frontend/src/components/themes/theme-layer.tsx`

**Checkpoint**: US2 complete and independently testable.

---

## Phase 5: User Story 3 - Sidebar Resize Control and Zoom Model Restoration (Priority: P2)

**Goal**: Deliver scalable sidebar controls with global resize toggle, shift-hold behavior, and restored zoom behavior (baseline sensitivity, no vertical momentum continuation, horizontal inertial continuation allowed).

**Independent Test**: Sidebar exposes `Resize`, resize mode works via toggle or Shift-hold for themes/memories, vertical zoom stops at gesture end, horizontal inertial continuation remains.

### Tests for User Story 3 (MANDATORY)

- [X] T051 [P] [US3] Add frontend unit test for sidebar action state including global resize toggle in `frontend/tests/themes/action-sidebar-state.test.tsx`
- [X] T052 [P] [US3] Add frontend unit test for visual layer ordering constraints in `frontend/tests/themes/theme-visual-layering.test.tsx`
- [X] T053 [P] [US3] Add frontend unit test for vertical momentum suppression and horizontal inertial allowance in `frontend/tests/timeline/wheel-zoom.test.ts`
- [X] T054 [P] [US3] Add frontend unit test for restored zoom sensitivity baseline in `frontend/tests/timeline/zoom-sensitivity.test.ts`
- [X] T055 [P] [US3] Add frontend e2e test for sidebar actions and resize toggle workflow in `frontend/tests/themes/action-sidebar.spec.ts`
- [X] T056 [P] [US3] Add frontend e2e test for vertical-space expansion and unclipped controls in `frontend/tests/themes/timeline-vertical-space.spec.ts`
- [X] T057 [P] [US3] Add frontend e2e test for mixed gesture behavior (vertical no-momentum, horizontal inertial) in `frontend/tests/memories/timeline-gesture-independence.spec.ts`

### Implementation for User Story 3

- [X] T058 [US3] Implement global `Resize` control in sidebar UI in `frontend/src/components/layout/action-sidebar.tsx`
- [X] T059 [US3] Integrate resize toggle and mode transitions in page state in `frontend/src/pages/timeline-page.tsx`
- [X] T060 [US3] Implement Shift-hold activation/deactivation for resize mode in `frontend/src/pages/timeline-page.tsx` and `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T061 [US3] Gate theme edge-resize and memory move behavior behind global resize mode in `frontend/src/components/themes/theme-layer.tsx` and `frontend/src/components/memories/memory-layer.tsx`
- [X] T062 [US3] Restore timeline zoom sensitivity baseline in `frontend/src/services/timeline/timeline-state.ts`
- [X] T063 [US3] Enforce vertical no-momentum and horizontal inertial continuation in `frontend/src/services/timeline/wheel-zoom.ts` and `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T064 [US3] Finalize timeline vertical space + layering z-index rules in `frontend/src/index.css`

**Checkpoint**: US3 complete and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate full feature behavior, screenshot sanity loop, and docs/evidence sync.

- [X] T065 [P] Refresh memory screenshot sanity captures and assertions in `frontend/tests/memories/ui-sanity-screens.spec.ts`
- [X] T066 [P] Refresh theme/sidebar screenshot sanity captures and assertions in `frontend/tests/themes/ui-sanity-screens.spec.ts`
- [X] T067 [P] Add/refresh live frontend-backend smoke coverage for memory+theme endpoints in `frontend/tests/timeline-live.spec.ts`
- [X] T068 Run full backend verification suite and resolve regressions in `backend/tests/`
- [X] T069 Run full frontend unit/e2e verification suites and resolve regressions in `frontend/tests/`
- [X] T070 Update quickstart verification steps for resize mode and delete modal behavior in `specs/004-timeline-themes-sidebar/quickstart.md`
- [X] T071 Update verification evidence log with command outputs and screenshot sets in `specs/004-timeline-themes-sidebar/verification-evidence.md`
- [X] T072 [US1] Implement continuous memory reposition updates during resize-mode drag in `frontend/src/components/memories/memory-layer.tsx`
- [X] T073 [US2] Add theme corner-resize affordances and drag behavior in `frontend/src/components/themes/theme-block.tsx` and `frontend/src/components/themes/theme-layer.tsx`
- [X] T074 [US3] Suppress memory/theme hover tooltip surfaces while resize mode is active in `frontend/src/components/memories/memory-layer.tsx` and `frontend/src/components/themes/theme-block.tsx`
- [X] T075 [P] [US3] Add e2e regression coverage for resize-mode memory move and theme corner-resize in `frontend/tests/memories/memory-resize-mode-move.spec.ts` and `frontend/tests/themes/theme-resize-mode.spec.ts`
- [X] T076 [US3] Clear resize-target selection on resize-mode exit to prevent auto-opening details panels in `frontend/src/pages/timeline-page.tsx`
- [X] T077 [P] [US3] Add e2e regression for resize-mode exit no-auto-open behavior in `frontend/tests/themes/resize-exit-no-auto-open.spec.ts`
- [X] T078 [US3] Clear resize-target selection before Shift-release resize exit to eliminate transient details-panel flicker in `frontend/src/pages/timeline-page.tsx`
- [X] T079 [US3] Restore responsive trackpad zoom and remove over-aggressive vertical burst cap in `frontend/src/services/timeline/wheel-zoom.ts` and `frontend/src/services/timeline/timeline-state.ts`
- [X] T080 [P] [US3] Update zoom regression expectations for restored sensitivity in `frontend/tests/timeline/zoom-sensitivity.test.ts`
- [X] T081 [US3] Prevent Shift-triggered resize activation while editing memory/theme form fields in `frontend/src/pages/timeline-page.tsx`
- [X] T082 [P] [US3] Add e2e regression coverage for Shift ignored in editing interfaces in `frontend/tests/themes/shift-ignored-in-edit.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user story work.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; can proceed in parallel with US1.
- **Phase 5 (US3)**: Depends on Phase 2 and integrates with US1/US2 interaction layers.
- **Phase 6 (Polish)**: Depends on completion of all selected user stories.

### User Story Dependencies

- **US1**: Independent after foundational phase.
- **US2**: Independent after foundational phase.
- **US3**: Depends on foundational phase and integrates with US1/US2 UI layers, but remains independently testable.

### Within Each User Story

- Write tests first and confirm they fail.
- Implement backend/domain primitives before page-level wiring when both are touched.
- Complete behavior + verification for a story before closing that story.

## Parallel Execution Examples

### User Story 1

- Run in parallel: T018, T019, T020, T021, T022, T023
- Then run in parallel where safe: T024, T029, T030, T031
- Then integrate sequentially: T025 -> T026 -> T027 -> T028

### User Story 2

- Run in parallel: T032, T033, T034, T035, T036, T037, T038
- Backend sequence: T039 -> T040 -> T041
- Frontend parallel core: T042, T043, T044, T048, T049, T050
- Frontend integration: T045 -> T046 -> T047

### User Story 3

- Run in parallel: T051, T052, T053, T054, T055, T056, T057
- Implementation: T058, T059, T060, T061, T062, T063, T064

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Deliver US1 (Phase 3) first and validate independently.
3. Then deliver US2 and US3 incrementally.

### Incremental Delivery

1. US1: memory hover + dedicated confirm modals + memory resize-mode move.
2. US2: theme lifecycle + edge-activated resize + dedicated confirm modal.
3. US3: global resize controls + shift semantics + zoom model restoration.
4. Polish: screenshot sanity loop, full-suite verification, evidence/docs updates.

### Team Parallelization

1. Engineer A: backend theme/memory API and contracts (T006-T012, T029-T041).
2. Engineer B: frontend memory interactions/modals (T024-T031).
3. Engineer C: frontend themes/sidebar/zoom behavior (T042-T064).
4. Shared: final regression and evidence/doc updates (T065-T071).
