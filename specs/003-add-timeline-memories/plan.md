# Implementation Plan: Timeline Memory Interactions

**Branch**: `003-add-timeline-memories` | **Date**: 2026-02-22 | **Spec**: `/Users/brianandres/Documents/Timeline/specs/003-add-timeline-memories/spec.md`
**Input**: Feature specification from `/specs/003-add-timeline-memories/spec.md`

## Summary

Implement timeline-attached memory creation, inspection, editing, and safe deletion
with deterministic timeline alignment and density behavior, while persisting
session memory data in the backend database. The solution extends both backend
(FastAPI + DB persistence) and frontend (interactive memory overlays + details
surface) and preserves existing timeline pan/zoom semantics.

## Technical Context

**Language/Version**: Python 3.13 (backend), TypeScript 5.x (frontend)  
**Primary Dependencies**: FastAPI, Pydantic, SQLModel/SQLAlchemy, Uvicorn, React 18, Vite, Playwright  
**Storage**: Backend relational database (SQLite for local development; schema designed for DB portability)  
**Testing**: pytest (backend), Vitest + Playwright (frontend/browser integration)  
**Target Platform**: Local web app (desktop browsers) backed by HTTP API service  
**Project Type**: Web application (frontend + backend API)  
**Performance Goals**: Memory create/edit/delete UI feedback under 100ms perceived latency in local runs; pan/zoom remains visually smooth under active memory overlays  
**Constraints**: Timeline coordinate mapping remains source of truth; memory interactions cannot break pan/zoom; delete must be reversible; browser-to-live-backend validation required  
**Scale/Scope**: Single-user session memory workflows, deterministic density simplification, and persistence for typical timeline usage (hundreds to low thousands of memories per timeline)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first compliance: `spec.md` defines prioritized user stories, measurable
      outcomes, and explicit constraints.
- [x] Independent value slices: plan preserves independently testable story slices
      (create/inspect, edit, delete+safety+density).
- [x] Verification scope: validation commands and browser + backend integration
      tests are identified for changed frontend/backend behavior.
- [x] Dependency execution: backend/frontend runtime and test dependencies are
      identified and planned for installation during task execution.
- [x] Test-first workflow: unit/contract/browser tests are planned before
      implementation tasks and gate completion.
- [x] Template/script compatibility: no `.specify` template/script behavior changes
      required for this feature.
- [x] Full-stack integrity: explicit API contracts, DB model, and frontend
      integration validation are included.
- [x] Browser verification: live browser tests against running backend are
      included for user-visible memory behavior.
- [x] Governance traceability: no constitution amendment required for this plan.

### Post-Design Constitution Check

- [x] All clarification gaps are resolved in `research.md`.
- [x] `data-model.md`, contracts, and quickstart are aligned with persistence and
      interaction requirements.
- [x] Test plan includes backend unit/API tests and browser integration tests
      against live backend.

## Project Structure

### Documentation (this feature)

```text
specs/003-add-timeline-memories/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── memories-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── models/
│   ├── services/
│   └── repositories/
└── tests/

frontend/
├── src/
│   ├── components/
│   │   └── memories/
│   ├── services/
│   │   └── memories/
│   └── pages/
└── tests/
    └── memories/
```

**Structure Decision**: Use the existing web-app split (`backend/` + `frontend/`)
with new memory modules in each layer, because this feature now requires backend
DB persistence plus frontend direct-manipulation interactions.

## Phase 0: Research Plan

1. Select backend persistence model and migration strategy for session memory data.
2. Define API contract strategy for point/range memory operations and undo delete.
3. Define deterministic density simplification approach that remains reversible.
4. Define interaction conflict handling between memory drag edits and timeline pan.
5. Define browser verification strategy for live frontend/backend memory workflows.

## Phase 1: Design Plan

1. Define memory domain entities, temporal anchor model, and state transitions in
   `data-model.md`.
2. Define API contracts in `contracts/memories-api.yaml` for create/read/update/
   delete/undo and range edits.
3. Define local run and verification instructions in `quickstart.md`.
4. Update Codex agent context to include backend persistence + contracts.

## Complexity Tracking

No constitution violations requiring exceptions.
