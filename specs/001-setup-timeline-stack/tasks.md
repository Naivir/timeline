# Tasks: Timeline Foundation

**Input**: Design documents from `/specs/001-setup-timeline-stack/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Verification tasks are included to satisfy constitution-aligned quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths in this task list target a split frontend/backend structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling setup

- [X] T001 Create backend folder structure in `backend/src/api/`, `backend/src/models/`, `backend/src/services/`, and `backend/tests/`
- [X] T002 Create frontend folder structure in `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/services/`, and `frontend/tests/`
- [X] T003 Initialize backend dependencies and project metadata in `backend/requirements.txt` and `backend/pyproject.toml`
- [X] T004 Initialize frontend app and scripts in `frontend/package.json`, `frontend/vite.config.ts`, and `frontend/index.html`
- [X] T005 Configure Tailwind and shadcn/ui baseline in `frontend/tailwind.config.ts`, `frontend/postcss.config.js`, and `frontend/src/components/ui/`
- [X] T006 Add environment templates for API base URL in `frontend/.env.example` and `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Implement backend FastAPI app bootstrap and router registration in `backend/src/main.py` and `backend/src/api/__init__.py`
- [X] T008 [P] Implement shared backend schemas for timeline and health responses in `backend/src/models/timeline.py` and `backend/src/models/health.py`
- [X] T009 [P] Implement timeline service interface and in-memory provider in `backend/src/services/timeline_service.py`
- [X] T010 Implement API route modules for health and timeline endpoints in `backend/src/api/health.py` and `backend/src/api/timeline.py`
- [X] T011 Implement frontend API client with typed response parsing in `frontend/src/services/timeline-api.ts`
- [X] T012 Implement frontend app shell and route entry for timeline page in `frontend/src/App.tsx` and `frontend/src/pages/timeline-page.tsx`
- [X] T013 Add shared UI state handling utilities (`loading`, `ready`, `error`) in `frontend/src/services/view-state.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Base Timeline (Priority: P1) 🎯 MVP

**Goal**: Render a straight timeline baseline on first page load as a clear visual anchor.

**Independent Test**: Open the app and verify a straight timeline line appears in the main viewport when no events exist.

### Implementation for User Story 1

- [X] T014 [US1] Implement baseline timeline component rendering in `frontend/src/components/timeline-baseline.tsx`
- [X] T015 [US1] Integrate baseline component into timeline page layout in `frontend/src/pages/timeline-page.tsx`
- [X] T016 [P] [US1] Add baseline visual styling tokens and layout classes in `frontend/src/index.css`
- [X] T017 [US1] Add empty-state rendering branch for no event placeholders in `frontend/src/pages/timeline-page.tsx`
- [X] T018 [US1] Add basic accessibility labels for timeline region in `frontend/src/components/timeline-baseline.tsx`

**Checkpoint**: User Story 1 is fully functional and independently demoable

---

## Phase 4: User Story 2 - Load Timeline From Service (Priority: P2)

**Goal**: Load and render timeline data from backend API on page open.

**Independent Test**: Start backend and frontend, load timeline page, and confirm displayed baseline is sourced from API response.

### Implementation for User Story 2

- [X] T019 [US2] Implement `GET /api/v1/timeline` handler using service layer in `backend/src/api/timeline.py`
- [X] T020 [US2] Implement timeline payload assembly and validation in `backend/src/services/timeline_service.py`
- [X] T021 [US2] Wire frontend data fetch on timeline page initialization in `frontend/src/pages/timeline-page.tsx`
- [X] T022 [P] [US2] Map API payload to frontend timeline view model in `frontend/src/services/timeline-mapper.ts`
- [X] T023 [US2] Render API-driven timeline labels/metadata in `frontend/src/components/timeline-baseline.tsx`

**Checkpoint**: User Stories 1 and 2 work end-to-end with live backend data

---

## Phase 5: User Story 3 - Handle Unavailable Service Gracefully (Priority: P3)

**Goal**: Show a readable error state and retry path when timeline API is unavailable.

**Independent Test**: Stop backend, refresh page, and confirm user sees retry-oriented error state without app crash.

### Implementation for User Story 3

- [X] T024 [US3] Implement backend health endpoint in `backend/src/api/health.py`
- [X] T025 [US3] Implement frontend error-state rendering for failed timeline requests in `frontend/src/pages/timeline-page.tsx`
- [X] T026 [US3] Implement retry action that re-runs timeline fetch in `frontend/src/pages/timeline-page.tsx`
- [X] T027 [P] [US3] Add reusable error banner UI component in `frontend/src/components/timeline-error-banner.tsx`
- [X] T028 [US3] Add service unavailability response contract handling in `frontend/src/services/timeline-api.ts`

**Checkpoint**: All user stories are independently functional and resilient

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and documentation across all stories

- [X] T029 [P] Add backend endpoint verification tests for timeline and health in `backend/tests/test_api_timeline.py`
- [X] T030 [P] Add frontend timeline page tests for loading/ready/error states in `frontend/tests/timeline-page.test.tsx`
- [X] T031 Add end-to-end smoke scenario for success and unavailable-service flows in `frontend/tests/timeline-smoke.spec.ts`
- [X] T032 Validate API contract alignment with implementation in `specs/001-setup-timeline-stack/contracts/timeline-api.openapi.yaml`
- [X] T033 Update setup/run instructions if needed after implementation in `specs/001-setup-timeline-stack/quickstart.md`

---

## Phase 7: Clarification Delta (Spec 2026-02-22)

**Purpose**: Implement and verify new clarified requirements (FR-009 to FR-012)

- [X] T034 Add backend CORS middleware for approved local frontend origins in `backend/src/main.py`
- [X] T035 Add backend CORS verification test coverage in `backend/tests/test_api_timeline.py`
- [X] T036 Run browser-based live backend verification via Playwright web servers in `frontend/playwright.config.ts`
- [X] T037 Add at least one live frontend-to-backend browser test in `frontend/tests/timeline-live.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story phases (Phase 3-5)**: Depend on Foundational completion
  - Preferred order: US1 (P1) -> US2 (P2) -> US3 (P3)
  - US3 depends on US2 API fetch path being in place
- **Polish (Phase 6)**: Depends on completion of target user stories

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational and is MVP by itself
- **US2 (P2)**: Depends on foundational API client and backend routing; builds on US1 layout
- **US3 (P3)**: Depends on US2 fetch/error plumbing; can be completed independently once fetch path exists

### Within Each User Story

- Implement component/service primitives first
- Integrate page/endpoint flows next
- Finalize user-visible states and accessibility/error handling last

---

## Parallel Example: User Story 1

```bash
# Parallelizable US1 tasks:
Task: "T016 [US1] Add baseline visual styling in frontend/src/index.css"
Task: "T018 [US1] Add accessibility labels in frontend/src/components/timeline-baseline.tsx"
```

## Parallel Example: User Story 2

```bash
# Parallelizable US2 tasks:
Task: "T022 [US2] Map API payload in frontend/src/services/timeline-mapper.ts"
Task: "T020 [US2] Implement timeline payload assembly in backend/src/services/timeline_service.py"
```

## Parallel Example: User Story 3

```bash
# Parallelizable US3 tasks:
Task: "T027 [US3] Add error banner component in frontend/src/components/timeline-error-banner.tsx"
Task: "T024 [US3] Implement health endpoint in backend/src/api/health.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1)
3. Validate baseline timeline rendering as MVP milestone

### Incremental Delivery

1. Ship MVP baseline timeline (US1)
2. Add live backend data integration (US2)
3. Add graceful failure and retry behavior (US3)
4. Finish with verification and documentation updates (Phase 6)

### Parallel Team Strategy

1. Team aligns on Phase 1 and Phase 2
2. After foundations are ready:
   - Developer A: US1 UI baseline and layout
   - Developer B: US2 backend/API data pipeline
   - Developer C: US3 error/retry UX
3. Converge in Phase 6 for verification and contract alignment

---

## Notes

- All tasks use strict checklist format with checkbox, task ID, optional `[P]`, required `[US#]` in story phases, and explicit file path.
- Suggested MVP scope: complete through Phase 3 (US1) before expanding to API/data and resiliency stories.
