# Tasks: Timeline Memory Interactions

**Input**: Design documents from `/specs/003-add-timeline-memories/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are MANDATORY. For each user story, tests MUST be authored and executed before implementation tasks, must fail first, and must pass before the story is marked complete.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure local/runtime/test prerequisites and baseline verification workflow are ready.

- [X] T001 Install/verify backend dependencies with uv in `backend/pyproject.toml` and `backend/uv.lock`
- [X] T002 Install/verify frontend dependencies and browser runtime in `frontend/package.json` and `frontend/package-lock.json`
- [X] T003 [P] Verify backend test fixture/db setup in `backend/tests/conftest.py`
- [X] T004 [P] Verify frontend memory test helpers in `frontend/tests/memories/test-helpers.ts`
- [X] T005 Define iterative screenshot sanity workflow and commands in `specs/003-add-timeline-memories/quickstart.md`
- [X] T006 Define evidence capture template for tests + screenshot review in `specs/003-add-timeline-memories/verification-evidence.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Align backend schema/contracts/types with current clarified spec before story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Implement DB startup migration guard for legacy schema compatibility in `backend/src/db.py`
- [X] T008 [P] Align memory persistence model fields (`tags`, `vertical_ratio`, anchor invariants) in `backend/src/models/memory.py`
- [X] T009 [P] Align request/response schemas for tags + vertical ratio in `backend/src/models/memory_schemas.py`
- [X] T010 Implement repository mapping for tags + vertical ratio snapshots/updates in `backend/src/repositories/memory_repository.py`
- [X] T011 Implement service-layer mapping/validation for new schema fields in `backend/src/services/memory_service.py`
- [X] T012 [P] Align frontend memory domain types (`tags`, `verticalRatio`) in `frontend/src/services/memories/memory-types.ts`
- [X] T013 Implement frontend API client payload/response parity for updated contract in `frontend/src/services/memories/memory-api.ts`
- [X] T014 Update API contract schemas/endpoints to match implemented memory shape in `specs/003-add-timeline-memories/contracts/memories-api.yaml`
- [X] T015 Reconcile data model docs (`tags` instead of category/type) in `specs/003-add-timeline-memories/data-model.md`
- [X] T016 Wire and verify memory routes/startup DB init in `backend/src/api/memories.py` and `backend/src/main.py`

**Checkpoint**: Foundational contract/data alignment complete; user stories can proceed.

---

## Phase 3: User Story 1 - Create and Inspect Memories (Priority: P1) 🎯 MVP

**Goal**: Users can place a memory intentionally, inspect it in a centered large modal, and cancel-creation safely without leaving orphaned memories.

**Independent Test**: Click `New Memory` -> click timeline to place -> centered large editor opens; cancel prompts confirmation and discards created memory; clicking existing memory opens details reliably.

### Tests for User Story 1 (MANDATORY) ⚠️

- [X] T017 [P] [US1] Add backend contract tests for create + discard-on-cancel semantics in `backend/tests/contract/test_memories_contract.py`
- [X] T018 [P] [US1] Add backend integration test proving cancel-discard removes newly created memory in `backend/tests/integration/test_memory_create_cancel_discard.py`
- [X] T019 [P] [US1] Add frontend unit test for connector geometry always terminating at timeline axis in `frontend/tests/memories/memory-positioning.test.ts`
- [X] T020 [P] [US1] Add frontend unit test for click-to-open behavior without drag side effects in `frontend/tests/memories/memory-selection.test.ts`
- [X] T021 [P] [US1] Add browser test for create -> centered modal -> cancel confirm -> memory discarded in `frontend/tests/memories/create-cancel-discard.spec.ts`
- [X] T022 [P] [US1] Add browser screenshot sanity test for placement + centered modal states in `frontend/tests/memories/ui-sanity-screens.spec.ts`

### Implementation for User Story 1

- [X] T023 [US1] Implement `New Memory` placement arming and click-to-place flow in `frontend/src/pages/timeline-page.tsx`
- [X] T024 [US1] Implement timeline placement handoff (horizontal + vertical intent) in `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T025 [US1] Implement memory layer placement/select orchestration in `frontend/src/components/memories/memory-layer.tsx`
- [X] T026 [US1] Implement connector geometry from marker edge to axis in `frontend/src/components/memories/memory-marker.tsx`
- [X] T027 [US1] Implement centered large responsive details/edit modal layout in `frontend/src/components/memories/memory-details-panel.tsx`
- [X] T028 [US1] Add cancel-confirmation flow and discard callback for newly created memory in `frontend/src/components/memories/memory-details-panel.tsx`
- [X] T029 [US1] Implement backend delete-on-cancel create flow support in `backend/src/services/memory_service.py` and `backend/src/api/memories.py`
- [X] T030 [US1] Implement create/cancel client orchestration in `frontend/src/services/memories/memory-api.ts` and `frontend/src/pages/timeline-page.tsx`
- [X] T031 [US1] Apply modal sizing/centering and non-overlap styles in `frontend/src/index.css`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Edit Memory Content and Time (Priority: P2)

**Goal**: Users can edit title/description/tags, view friendly timestamp, and adjust temporal anchors with smooth interaction and slower zoom.

**Independent Test**: Select memory -> edit tags/metadata -> see human-friendly timestamp and footer metadata layout; drag anchors updates time; zoom is noticeably slower and controlled.

### Tests for User Story 2 (MANDATORY) ⚠️

- [X] T032 [P] [US2] Add backend contract tests for PATCH tags/anchor updates in `backend/tests/contract/test_memories_patch_contract.py`
- [X] T033 [P] [US2] Add backend integration tests for point/range anchor direct manipulation persistence in `backend/tests/integration/test_memory_edit_temporal_anchor.py`
- [X] T034 [P] [US2] Add frontend unit tests for drag-edit calculations (point/range/handles) in `frontend/tests/memories/memory-drag-edit.test.ts`
- [X] T035 [P] [US2] Add frontend unit test for slowed zoom factor behavior in `frontend/tests/timeline/zoom-sensitivity.test.ts`
- [X] T036 [P] [US2] Add browser test for edit metadata (tags + friendly timestamp rendering) in `frontend/tests/memories/edit-memory.spec.ts`
- [X] T037 [P] [US2] Add browser screenshot sanity test for inspect/edit metadata layout in `frontend/tests/memories/ui-sanity-screens.spec.ts`

### Implementation for User Story 2

- [X] T038 [US2] Implement range-memory rendering and handle interactions in `frontend/src/components/memories/memory-range.tsx`
- [X] T039 [US2] Implement drag behavior arbitration for point/range editing in `frontend/src/components/memories/memory-layer.tsx`
- [X] T040 [US2] Implement details form support for comma-separated tags in `frontend/src/components/memories/memory-details-panel.tsx`
- [X] T041 [US2] Implement human-friendly timestamp formatter and rendering in `frontend/src/components/memories/memory-details-panel.tsx`
- [X] T042 [US2] Implement details metadata footer layout (`Tags` bottom-left, timestamp adjacent) in `frontend/src/components/memories/memory-details-panel.tsx` and `frontend/src/index.css`
- [X] T043 [US2] Implement backend tag persistence and mapping updates in `backend/src/repositories/memory_repository.py` and `backend/src/services/memory_service.py`
- [X] T044 [US2] Implement slower zoom sensitivity target (~5% per notch) in `frontend/src/services/timeline/timeline-state.ts`
- [X] T045 [US2] Ensure edit/save optimistic updates remain consistent with API responses in `frontend/src/pages/timeline-page.tsx`

**Checkpoint**: User Stories 1 and 2 are independently functional.

---

## Phase 5: User Story 3 - Delete Safely and Preserve Interaction Quality (Priority: P3)

**Goal**: Users can delete from details surface with undo safety; dense timelines remain deterministic without breaking core timeline gestures.

**Independent Test**: Delete selected memory from details, undo restore within window, verify expiration behavior, and confirm timeline pan/zoom and memory interactions coexist under density simplification.

### Tests for User Story 3 (MANDATORY) ⚠️

- [X] T046 [P] [US3] Add backend contract tests for delete + undo endpoints in `backend/tests/contract/test_memories_delete_undo_contract.py`
- [X] T047 [P] [US3] Add backend integration test for undo-window expiration in `backend/tests/integration/test_memory_delete_undo_window.py`
- [X] T048 [P] [US3] Add frontend unit tests for deterministic density simplification in `frontend/tests/memories/memory-density.test.ts`
- [X] T049 [P] [US3] Add browser test for delete + undo + density behavior in `frontend/tests/memories/delete-undo-density.spec.ts`
- [X] T050 [P] [US3] Add browser screenshot sanity test for delete/undo UI states in `frontend/tests/memories/ui-sanity-screens.spec.ts`

### Implementation for User Story 3

- [X] T051 [US3] Implement visible delete action in details modal in `frontend/src/components/memories/memory-details-panel.tsx`
- [X] T052 [US3] Implement delete endpoint + deletion record creation in `backend/src/api/memories.py` and `backend/src/services/memory_service.py`
- [X] T053 [US3] Implement undo endpoint + expiration enforcement in `backend/src/services/memory_service.py` and `backend/src/repositories/memory_repository.py`
- [X] T054 [US3] Implement frontend undo affordance and selection restoration handling in `frontend/src/components/memories/memory-details-panel.tsx` and `frontend/src/pages/timeline-page.tsx`
- [X] T055 [US3] Implement deterministic density display modes in `frontend/src/components/memories/memory-layer.tsx`
- [X] T056 [US3] Enforce gesture ownership so empty-space drag pans and memory-target drag edits in `frontend/src/components/timeline/timeline-surface.tsx`

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final parity checks, performance confidence, and full verification evidence.

- [X] T057 [P] Add backend schema-compatibility regression test for legacy DBs in `backend/tests/integration/test_db_schema_migration.py`
- [X] T058 [P] Add browser regression for pan/zoom + memory interaction coexistence in `frontend/tests/memories/timeline-gesture-independence.spec.ts`
- [X] T059 Validate contract-to-implementation parity for all memory fields/actions in `specs/003-add-timeline-memories/contracts/memories-api.yaml`
- [X] T060 Run full backend and frontend verification commands and record outcomes in `specs/003-add-timeline-memories/verification-evidence.md`
- [X] T061 Capture and manually review screenshot artifacts for every changed screen/popup in `specs/003-add-timeline-memories/verification-evidence.md`
- [X] T062 Update runbook with final commands and expected behavior checkpoints in `specs/003-add-timeline-memories/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies.
- **Phase 2 (Foundational)**: depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: depends on Phase 2.
- **Phase 4 (US2)**: depends on Phase 2 and consumes US1 interaction primitives.
- **Phase 5 (US3)**: depends on Phase 2 and CRUD/edit baselines from US1/US2.
- **Phase 6 (Polish)**: depends on completed implementation for all targeted stories.

### User Story Dependencies

- **US1 (P1)**: baseline memory placement and inspect flow.
- **US2 (P2)**: extends US1 with edit/tags/timestamp/zoom behavior.
- **US3 (P3)**: extends US1/US2 with delete/undo and density safety.

### Within Each User Story

- Tests MUST be written and run first (expected to fail before implementation).
- Backend contract/integration tests precede backend implementation tasks.
- Frontend unit/browser tests precede frontend implementation tasks.
- Story is complete only when all associated tests pass.

### Parallel Opportunities

- Setup and foundational tasks marked `[P]` can run in parallel.
- Test tasks within each story marked `[P]` can run in parallel.
- Backend/frontend implementation tasks touching separate files can run in parallel after dependencies are met.

---

## Parallel Example: User Story 1

```bash
Task: "T017 [US1] Backend create/cancel contract tests in backend/tests/contract/test_memories_contract.py"
Task: "T020 [US1] Frontend click-open unit test in frontend/tests/memories/memory-selection.test.ts"
Task: "T022 [US1] Screenshot sanity browser test in frontend/tests/memories/ui-sanity-screens.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T032 [US2] Backend PATCH contract tests in backend/tests/contract/test_memories_patch_contract.py"
Task: "T035 [US2] Zoom sensitivity unit test in frontend/tests/timeline/zoom-sensitivity.test.ts"
Task: "T036 [US2] Browser metadata/timestamp edit test in frontend/tests/memories/edit-memory.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T046 [US3] Delete/undo contract tests in backend/tests/contract/test_memories_delete_undo_contract.py"
Task: "T048 [US3] Density unit tests in frontend/tests/memories/memory-density.test.ts"
Task: "T049 [US3] Browser delete/undo/density test in frontend/tests/memories/delete-undo-density.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1.
4. Validate US1 independently via backend + frontend + browser + screenshot sanity checks.

### Incremental Delivery

1. Deliver US1 (create/inspect + cancel discard).
2. Deliver US2 (edit/tags/friendly timestamp/slower zoom).
3. Deliver US3 (delete/undo + deterministic density).
4. Complete polish and evidence capture.

### Parallel Team Strategy

1. Complete setup/foundational tasks jointly.
2. Split by capability after foundations:
   - Backend: contracts/services/repository/api.
   - Frontend: memory UI interactions/modals/layout.
   - QA: browser and screenshot sanity verification.

---

## Notes

- All tasks use strict checklist format with task ID, optional `[P]`, optional `[US#]`, and concrete file paths.
- Screenshot sanity validation is mandatory and iterative: analyze screenshots, write failing tests for visual defects, fix, rerun, and re-review.
- Suggested MVP scope: through Phase 3 (US1) after Setup + Foundational.
