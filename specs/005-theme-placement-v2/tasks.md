# Tasks: Theme Placement v2

**Input**: Design documents from `/specs/005-theme-placement-v2/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are MANDATORY. For each user story, tests are written first, must fail first, then pass after implementation.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm toolchain and verification flow for this feature.

- [X] T001 Install backend dependencies with `uv sync` in `backend/pyproject.toml`
- [X] T002 Install frontend dependencies with `npm install` in `frontend/package.json`
- [X] T003 Install browser test runtime with `npx playwright install` using `frontend/playwright.config.ts`
- [X] T004 Define screenshot evidence capture locations for this feature in `specs/005-theme-placement-v2/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared contracts, schema shape, and geometry utilities required before user-story work.

**⚠️ CRITICAL**: No user story work starts before this phase is complete.

- [X] T005 Update theme placement API contract for floating geometry in `specs/005-theme-placement-v2/contracts/themes-placement-v2-api.yaml`
- [X] T006 [P] Add backend theme schema fields for floating geometry in `backend/src/models/theme_schemas.py`
- [X] T007 [P] Add backend theme persistence fields for floating geometry in `backend/src/models/theme.py`
- [X] T008 Implement repository mapping for top/bottom geometry persistence in `backend/src/repositories/theme_repository.py`
- [X] T009 Implement service-level geometry validation/normalization in `backend/src/services/theme_service.py`
- [X] T010 Add shared 4px snap and anchor helpers in `frontend/src/services/themes/theme-geometry.ts`
- [X] T011 Align frontend theme type contracts with floating geometry fields in `frontend/src/services/themes/theme-types.ts`

**Checkpoint**: Foundation ready for story implementation.

---

## Phase 3: User Story 1 - Place Floating Theme Blocks Precisely (Priority: P1) 🎯 MVP

**Goal**: Deterministic drag-create with 4px snapping and above-axis floating placement.

**Independent Test**: Arm New Theme and perform both downward and upward drags; verify left-edge anchoring, direction semantics, above-axis constraint, live preview, and snapped result.

### Tests for User Story 1 (MANDATORY) ⚠️

- [X] T012 [P] [US1] Add backend contract create/list geometry assertions in `backend/tests/contract/test_themes_contract.py`
- [X] T013 [P] [US1] Add backend integration test for deterministic create anchoring in `backend/tests/integration/test_theme_placement_anchor_semantics.py`
- [X] T014 [P] [US1] Add frontend unit tests for snap + anchor math in `frontend/tests/themes/theme-placement-engine.test.ts`
- [X] T015 [P] [US1] Add browser test for upward/downward drag create behavior in `frontend/tests/themes/theme-create-drag-anchors.spec.ts`
- [X] T016 [P] [US1] Add browser screenshot sanity test for placement states in `frontend/tests/themes/theme-placement-screens.spec.ts`

### Implementation for User Story 1

- [X] T017 [US1] Implement create payload support for top/bottom geometry in `frontend/src/services/themes/theme-api.ts`
- [X] T018 [US1] Implement deterministic drag-create preview/commit in `frontend/src/components/themes/theme-layer.tsx`
- [X] T019 [US1] Implement above-axis placement clamping and float geometry rendering in `frontend/src/components/themes/theme-layer.tsx`
- [X] T020 [US1] Implement create endpoint handling for top/bottom geometry in `backend/src/api/themes.py`
- [X] T021 [US1] Implement create-time geometry validation and snap normalization in `backend/src/services/theme_service.py`
- [X] T022 [US1] Remove/disable manual height numeric entry in theme form in `frontend/src/components/themes/theme-details-panel.tsx`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Resize Theme with Independent Top and Bottom Control (Priority: P2)

**Goal**: Independent top and bottom resize handles with 4px snapped visual results and reliable saving.

**Independent Test**: Select a theme and resize top then bottom edges; verify independent edge control, snapped output, and successful save with no decimal failures.

### Tests for User Story 2 (MANDATORY) ⚠️

- [X] T023 [P] [US2] Add backend contract patch geometry validation tests in `backend/tests/contract/test_themes_patch_delete_contract.py`
- [X] T024 [P] [US2] Add backend integration test for post-resize save reliability in `backend/tests/integration/test_theme_resize_save_reliability.py`
- [X] T025 [P] [US2] Add frontend unit tests for top/bottom edge resize math in `frontend/tests/themes/theme-resize-edges.test.ts`
- [X] T026 [P] [US2] Add browser interaction test for top/bottom resize handles in `frontend/tests/themes/theme-resize-top-bottom.spec.ts`
- [X] T027 [P] [US2] Add browser screenshot sanity test for resize states in `frontend/tests/themes/theme-resize-screens.spec.ts`

### Implementation for User Story 2

- [X] T028 [US2] Implement top and bottom edge resize interactions in `frontend/src/components/themes/theme-block.tsx`
- [X] T029 [US2] Implement snapped top and bottom resize preview/commit flow in `frontend/src/components/themes/theme-layer.tsx`
- [X] T030 [US2] Implement patch payload support for top/bottom geometry in `frontend/src/services/themes/theme-api.ts`
- [X] T031 [US2] Implement backend patch validation for top/bottom geometry bounds in `backend/src/services/theme_service.py`
- [X] T032 [US2] Implement backend persistence updates for top/bottom geometry on patch in `backend/src/repositories/theme_repository.py`

**Checkpoint**: User Stories 1 and 2 both pass independently.

---

## Phase 5: User Story 3 - Use Consistent Placement Rules for Future Reuse (Priority: P3)

**Goal**: Consolidate create/resize geometry logic into reusable deterministic placement engine behavior.

**Independent Test**: Validate create and resize both call shared geometry helpers and produce identical snapping/anchoring rules.

### Tests for User Story 3 (MANDATORY) ⚠️

- [X] T033 [P] [US3] Add frontend unit regression tests ensuring shared helper usage for create/resize in `frontend/tests/themes/theme-placement-consistency.test.ts`
- [X] T034 [P] [US3] Add browser regression test for repeated mixed create/resize consistency in `frontend/tests/themes/theme-placement-consistency.spec.ts`
- [X] T035 [P] [US3] Add backend integration regression test for geometry round-trip consistency in `backend/tests/integration/test_theme_geometry_roundtrip.py`

### Implementation for User Story 3

- [X] T036 [US3] Refactor shared placement engine functions for create and resize paths in `frontend/src/services/themes/theme-geometry.ts`
- [X] T037 [US3] Update theme layer to consume shared engine for all geometry operations in `frontend/src/components/themes/theme-layer.tsx`
- [X] T038 [US3] Align backend service normalization with shared geometry invariants in `backend/src/services/theme_service.py`

**Checkpoint**: All user stories are independently functional and consistent.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cross-story hardening and verification evidence.

- [X] T039 [P] Update feature documentation and verification notes in `specs/005-theme-placement-v2/quickstart.md`
- [X] T040 [P] Run full backend verification suite and record outcomes in `specs/005-theme-placement-v2/quickstart.md`
- [X] T041 [P] Run frontend unit + e2e verification and record outcomes in `specs/005-theme-placement-v2/quickstart.md`
- [X] T042 [P] Capture final screenshot sanity evidence for changed screens in `specs/005-theme-placement-v2/quickstart.md`
- [X] T043 [P] Add regression test for pointer-release-off-surface theme creation in `frontend/tests/themes/theme-create-drag-anchors.spec.ts`
- [X] T044 [P] Add regression test for stable downward anchor (no top-left drift) in `frontend/tests/themes/theme-placement-engine.test.ts`
- [X] T045 Fix theme placement pointer-capture and release handling in `frontend/src/components/themes/theme-layer.tsx`
- [X] T046 Fix downward drag anchor stability in `frontend/src/services/themes/theme-geometry.ts`

---

## Phase 7: User Story 2 Extension - Corner Resize + Vertical Translation in Resize Mode (Priority: P2)

**Goal**: Add bottom-corner dual-axis resizing and whole-theme vertical movement (above-axis clamped) in resize mode.

**Independent Test**: In resize mode, drag bottom-left and bottom-right corners to confirm dual-axis behavior with top edge fixed, then drag theme body vertically and verify pure translation with no duration/height change and no below-axis crossing.

### Tests for User Story 2 Extension (MANDATORY) ⚠️

- [X] T047 [P] [US2] Add frontend unit tests for bottom-left and bottom-right corner drag geometry invariants in `frontend/tests/themes/theme-resize-edges.test.ts`
- [X] T048 [P] [US2] Add frontend unit tests for vertical translation preserving duration and height in `frontend/tests/themes/theme-placement-consistency.test.ts`
- [X] T049 [P] [US2] Add browser test for corner-handle resize behavior in `frontend/tests/themes/theme-resize-top-bottom.spec.ts`
- [X] T050 [P] [US2] Add browser test for resize-mode vertical theme movement with above-axis clamp in `frontend/tests/themes/theme-placement-consistency.spec.ts`
- [X] T051 [P] [US2] Add browser screenshot sanity test for corner-resize and vertical-move states in `frontend/tests/themes/theme-resize-screens.spec.ts`
- [X] T052 [P] [US2] Add backend integration test ensuring patch updates from corner resize and vertical move remain save-safe in `backend/tests/integration/test_theme_resize_save_reliability.py`

### Implementation for User Story 2 Extension

- [X] T053 [US2] Implement bottom-left and bottom-right corner handle interactions in `frontend/src/components/themes/theme-block.tsx`
- [X] T054 [US2] Implement corner-drag preview/commit math with 4px vertical snapping in `frontend/src/components/themes/theme-layer.tsx`
- [X] T055 [US2] Implement resize-mode whole-theme vertical drag translation with above-axis clamp in `frontend/src/components/themes/theme-layer.tsx`
- [X] T056 [US2] Extend shared placement engine functions for corner-drag and vertical-translate invariants in `frontend/src/services/themes/theme-geometry.ts`
- [X] T057 [US2] Align theme update payload generation for corner and vertical-translate commits in `frontend/src/services/themes/theme-api.ts`
- [X] T058 [US2] Enforce backend geometry invariants for corner resize and translation commits in `backend/src/services/theme_service.py`

**Checkpoint**: Extended US2 behavior is independently functional, snapped, clamped, and regression-tested.

---

## Phase 8: User Story 3 Extension - Theme Title Fit + Optional Abbreviated Title (Priority: P3)

**Goal**: Make in-block title rendering more lenient and deterministic using horizontal fit checks, with optional `abbreviatedTitle` fallback and 16px inclusive height threshold for full-title rendering.

**Independent Test**: Create/edit a theme with and without `abbreviatedTitle`, then zoom/resize themes to verify full-title fit, abbreviated-title fallback, tooltip fallback, and no premature hide while height is at least 16px inclusive.

### Tests for User Story 3 Extension (MANDATORY) ⚠️

- [X] T059 [P] [US3] Add backend contract tests for optional abbreviated title fields in list/create/update responses in `backend/tests/contract/test_themes_contract.py`
- [X] T060 [P] [US3] Add backend contract patch tests for abbreviated title updates in `backend/tests/contract/test_themes_patch_delete_contract.py`
- [X] T061 [P] [US3] Add backend integration tests for abbreviated title persistence and no auto-generation behavior in `backend/tests/integration/test_theme_geometry_roundtrip.py`
- [X] T062 [P] [US3] Add frontend unit tests for title selection priority (full -> abbreviated -> tooltip) using horizontal-fit checks in `frontend/tests/themes/theme-placement-consistency.test.ts`
- [X] T063 [P] [US3] Add frontend unit tests for full-title 16px inclusive height threshold in `frontend/tests/themes/theme-resize-edges.test.ts`
- [X] T064 [P] [US3] Add browser test for title behavior while zooming/resizing with and without abbreviated title in `frontend/tests/themes/theme-placement-consistency.spec.ts`
- [X] T065 [P] [US3] Add browser screenshot sanity test for full/abbreviated/tooltip title states in `frontend/tests/themes/theme-resize-screens.spec.ts`

### Implementation for User Story 3 Extension

- [X] T066 [US3] Add optional `abbreviatedTitle` model and schema fields for themes in `backend/src/models/theme.py`
- [X] T067 [US3] Map abbreviated title through API schema/repository/service layers in `backend/src/models/theme_schemas.py`
- [X] T068 [US3] Update theme API contract to include optional abbreviated title on create/update/list in `specs/005-theme-placement-v2/contracts/themes-placement-v2-api.yaml`
- [X] T069 [US3] Add abbreviated title field to frontend theme types and API payloads in `frontend/src/services/themes/theme-types.ts`
- [X] T070 [US3] Implement title rendering logic using measured horizontal fit + 16px full-title height threshold + abbreviated fallback in `frontend/src/components/themes/theme-block.tsx`
- [X] T071 [US3] Add abbreviated title editing support in theme form panels in `frontend/src/components/themes/theme-details-panel.tsx`

**Checkpoint**: Extended US3 title-display behavior is independently functional and test-verified.

---

## Phase 9: Polish & Cross-Cutting for New 005 Requirements

**Purpose**: Final verification and documentation for the new title-display requirements.

- [X] T072 [P] Update quickstart verification checklist for abbreviated title/title-fit flows in `specs/005-theme-placement-v2/quickstart.md`
- [X] T073 [P] Run backend + frontend targeted regression suite and record outcomes in `specs/005-theme-placement-v2/quickstart.md`
- [X] T074 [P] Capture and review screenshot evidence for full-title, abbreviated-title, and tooltip fallback states in `specs/005-theme-placement-v2/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): starts immediately.
- Phase 2 (Foundational): depends on Phase 1; blocks all user stories.
- Phase 3 (US1): depends on Phase 2 completion.
- Phase 4 (US2): depends on Phase 2 completion; may run after or in parallel with US1 if capacity allows.
- Phase 5 (US3): depends on Phase 2 completion and should start after US1/US2 core geometry behavior is stable.
- Phase 6 (Polish): depends on completion of all targeted user stories.
- Phase 7 (US2 Extension): depends on Phase 2 completion and extends US2 behavior; should run before final polish sign-off.
- Phase 8 (US3 Extension): depends on Phase 2 completion and extends US3 behavior with title-fit and abbreviated-title rules.
- Phase 9 (Polish for new requirements): depends on Phase 8 completion.

### User Story Dependencies

- US1 (P1): no user-story dependency; true MVP slice.
- US2 (P2): functionally independent but builds on the same theme geometry fields from foundational phase.
- US2 Extension (P2): depends on US2 base resize behavior and adds corner/translation semantics.
- US3 (P3): depends on behavior existing in US1/US2 so consistency can be enforced and verified.
- US3 Extension (P3): depends on US3 base consistency and adds title-fit + abbreviated-title display behavior.

### Within Each User Story

- Tests first and failing before code changes.
- API/model/service updates before UI wiring when schema changes are involved.
- Story-specific tests must pass before story completion.

## Parallel Execution Examples

### User Story 1

```bash
# Write failing tests in parallel
T012 + T013 + T014 + T015 + T016
```

### User Story 2

```bash
# Write failing tests in parallel
T023 + T024 + T025 + T026 + T027
```

### User Story 3

```bash
# Write failing tests in parallel
T033 + T034 + T035
```

### User Story 2 Extension

```bash
# Write failing tests in parallel
T047 + T048 + T049 + T050 + T051 + T052
```

### User Story 3 Extension

```bash
# Write failing tests in parallel
T059 + T060 + T061 + T062 + T063 + T064 + T065
```

## Implementation Strategy

### MVP First (US1 only)

1. Finish Phase 1 and Phase 2.
2. Complete US1 tests (red), implement US1 (green).
3. Validate US1 independently in browser + screenshots.

### Incremental Delivery

1. Deliver US1 (deterministic create + snapping).
2. Deliver US2 (top/bottom resize).
3. Deliver US3 (shared engine consistency).
4. Deliver US3 Extension (title fit + abbreviated title behavior).
5. Finish polish verification/evidence for new requirements.

### Parallel Team Strategy

1. One developer handles backend schema/service tasks (T006-T009).
2. One developer handles frontend geometry base (T010-T011).
3. After foundation, split by user story with test-first workflow.
