# Tasks: Timeline Navigation System

**Input**: Design documents from `/specs/002-timeline-navigation-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature requires test-first validation, including browser verification for interaction behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `frontend/src/`, `frontend/tests/`
- Paths below target timeline interaction modules under `frontend/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare project structure and tooling for timeline interaction feature work

- [X] T001 Create timeline feature folders in `frontend/src/components/timeline/`, `frontend/src/services/timeline/`, and `frontend/tests/timeline/`
- [X] T002 Install and verify frontend dependencies for interaction and browser tests in `frontend/package.json`
- [X] T003 [P] Configure shared timeline test bootstrap and helpers in `frontend/tests/timeline/test-helpers.ts`
- [X] T004 Define verification commands and expected outcomes in `specs/002-timeline-navigation-system/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core timeline engine infrastructure required before user-story behavior

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement timeline interaction state model in `frontend/src/services/timeline/timeline-state.ts`
- [X] T006 [P] Implement deterministic resolution-band rules in `frontend/src/services/timeline/resolution-rules.ts`
- [X] T007 [P] Implement time-to-position mapping utilities in `frontend/src/services/timeline/time-scale-mapping.ts`
- [X] T008 Implement label tick generation and spacing policy in `frontend/src/services/timeline/label-ticks.ts`
- [X] T009 Implement shared timeline surface shell with fixed vertical placement and fade edges in `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T010 Wire timeline feature entry into app page in `frontend/src/pages/timeline-page.tsx`

**Checkpoint**: Foundational timeline engine and shell are ready for story-specific behavior

---

## Phase 3: User Story 1 - Pan Through Time Continuously (Priority: P1) 🎯 MVP

**Goal**: Enable direct horizontal click-drag panning with proportional time-range updates.

**Independent Test**: Drag timeline left/right and verify visible range updates smoothly with no snapping and no vertical layout shift.

### Tests for User Story 1

- [X] T011 [P] [US1] Add unit tests for pan delta-to-range translation in `frontend/tests/timeline/pan-state.test.ts`
- [X] T012 [P] [US1] Add browser test for drag panning continuity in `frontend/tests/timeline/pan-interaction.spec.ts`

### Implementation for User Story 1

- [X] T013 [US1] Implement pointer drag handling for panning in `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T014 [US1] Apply proportional range updates during pan in `frontend/src/services/timeline/timeline-state.ts`
- [X] T015 [US1] Enforce no-snapping default behavior in `frontend/src/services/timeline/timeline-state.ts`
- [X] T016 [US1] Preserve fixed vertical timeline position during pan in `frontend/src/components/timeline/timeline-surface.tsx`

**Checkpoint**: User Story 1 independently works as MVP interaction slice

---

## Phase 4: User Story 2 - Zoom Across Time Resolutions (Priority: P2)

**Goal**: Support reversible zoom transitions across year/month/day/hour with focal-point preservation.

**Independent Test**: Zoom in/out repeatedly and verify deterministic resolution transitions with anchor-preserving behavior.

### Tests for User Story 2

- [X] T017 [P] [US2] Add unit tests for resolution threshold transitions in `frontend/tests/timeline/resolution-rules.test.ts`
- [X] T018 [P] [US2] Add unit tests for zoom anchor preservation in `frontend/tests/timeline/zoom-anchor.test.ts`
- [X] T019 [P] [US2] Add browser test for zoom in/out reversibility in `frontend/tests/timeline/zoom-interaction.spec.ts`

### Implementation for User Story 2

- [X] T020 [US2] Implement wheel/trackpad zoom input handling in `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T021 [US2] Implement reversible resolution transitions in `frontend/src/services/timeline/resolution-rules.ts`
- [X] T022 [US2] Implement focal-point anchor preservation during zoom in `frontend/src/services/timeline/timeline-state.ts`
- [X] T023 [US2] Update time-scale mapping recalculation on zoom in `frontend/src/services/timeline/time-scale-mapping.ts`

**Checkpoint**: User Stories 1 and 2 function with deterministic pan + zoom behavior

---

## Phase 5: User Story 3 - Read Time Labels While Navigating (Priority: P3)

**Goal**: Render dynamic, readable resolution-appropriate labels during pan and zoom.

**Independent Test**: Pan/zoom through all resolutions and verify label format correctness and readability constraints.

### Tests for User Story 3

- [X] T024 [P] [US3] Add unit tests for label format by resolution in `frontend/tests/timeline/label-format.test.ts`
- [X] T025 [P] [US3] Add unit tests for label density filtering in `frontend/tests/timeline/label-density.test.ts`
- [X] T026 [P] [US3] Add browser test for dynamic label updates in `frontend/tests/timeline/label-rendering.spec.ts`

### Implementation for User Story 3

- [X] T027 [US3] Implement resolution-specific label formatting in `frontend/src/services/timeline/label-ticks.ts`
- [X] T028 [US3] Implement adaptive label visibility filtering in `frontend/src/services/timeline/label-ticks.ts`
- [X] T029 [US3] Render dynamic label ticks and fades in `frontend/src/components/timeline/timeline-surface.tsx`
- [X] T030 [US3] Expose derived interaction state (`visibleRange`, `activeResolution`, `timeToX`) in `frontend/src/services/timeline/timeline-state.ts`

**Checkpoint**: All user stories independently function with readable, dynamic labels

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, scope guardrails, and documentation alignment

- [X] T031 [P] Add browser test ensuring no memory/attachment UI is rendered in `frontend/tests/timeline/scope-guard.spec.ts`
- [X] T032 Validate contract-to-implementation alignment in `specs/002-timeline-navigation-system/contracts/timeline-interaction-contract.md`
- [X] T033 Update quickstart verification steps for final interaction behavior in `specs/002-timeline-navigation-system/quickstart.md`
- [X] T034 [P] Add regression test for rapid pan/zoom alternation stability in `frontend/tests/timeline/interaction-stress.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user story work
- **User Story phases (Phase 3-5)**: Depend on Foundational completion
  - Preferred order: US1 (P1) -> US2 (P2) -> US3 (P3)
- **Polish (Phase 6)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: Depends on core state/mapping shell from Phase 2
- **US2 (P2)**: Depends on US1 interaction surface and foundational scale rules
- **US3 (P3)**: Depends on US1/US2 state outputs for label rendering context

### Within Each User Story

- Write tests first and confirm failures
- Implement core service logic
- Integrate component rendering/interaction hooks
- Re-run tests and confirm passing before phase completion

### Parallel Opportunities

- Phase 2 service modules (`resolution-rules`, `time-scale-mapping`) can be built in parallel
- Story-level unit tests marked `[P]` can run in parallel
- Browser specs for distinct behaviors can run in parallel after setup

---

## Parallel Example: User Story 1

```bash
# Parallelizable US1 tasks:
Task: "T011 [US1] Add pan translation tests in frontend/tests/timeline/pan-state.test.ts"
Task: "T012 [US1] Add pan browser test in frontend/tests/timeline/pan-interaction.spec.ts"
```

## Parallel Example: User Story 2

```bash
# Parallelizable US2 tasks:
Task: "T017 [US2] Add resolution transition tests in frontend/tests/timeline/resolution-rules.test.ts"
Task: "T018 [US2] Add zoom anchor tests in frontend/tests/timeline/zoom-anchor.test.ts"
```

## Parallel Example: User Story 3

```bash
# Parallelizable US3 tasks:
Task: "T024 [US3] Add label format tests in frontend/tests/timeline/label-format.test.ts"
Task: "T025 [US3] Add label density tests in frontend/tests/timeline/label-density.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1)
3. Validate continuous panning behavior before proceeding

### Incremental Delivery

1. Deliver pan interaction slice (US1)
2. Add deterministic zoom/resolution behavior (US2)
3. Add readable dynamic labels (US3)
4. Finalize cross-cutting regression coverage and docs (Phase 6)

### Parallel Team Strategy

1. Shared completion of Setup + Foundational phases
2. Then parallelize by capability:
   - Developer A: pan and pointer interaction
   - Developer B: zoom/resolution and mapping
   - Developer C: label generation and readability behavior
3. Converge on browser regression suite and quickstart

---

## Notes

- All tasks follow strict checklist format with IDs, optional `[P]`, required `[US#]` in story phases, and explicit file paths.
- Suggested MVP scope: through Phase 3 (US1) after Setup + Foundational.
