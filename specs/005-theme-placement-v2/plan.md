# Implementation Plan: Theme Placement v2 (Snapping + Floating + Deterministic Drag Anchors)

**Branch**: `005-theme-placement-v2` | **Date**: 2026-02-22 | **Spec**: `/Users/brianandres/Documents/Timeline/specs/005-theme-placement-v2/spec.md`
**Input**: Feature specification from `/Users/brianandres/Documents/Timeline/specs/005-theme-placement-v2/spec.md`

## Summary

Deliver deterministic theme rectangle placement/resizing with a reusable geometry
engine: 4px vertical snap grid, floating top/bottom edges (no baseline lock),
direction-dependent drag anchors for creation, independent top and bottom resize
handles, and save-safe geometry normalization that eliminates decimal-related
failures.

## Technical Context

**Language/Version**: Python 3.13 (backend), TypeScript 5.x + React 18 (frontend)  
**Primary Dependencies**: FastAPI, Pydantic/SQLModel/SQLAlchemy, Uvicorn, Vite, Vitest, Playwright  
**Storage**: Backend relational database (SQLite in local/dev; existing migration path)  
**Testing**: `uv run pytest` (backend), `npm run test` (frontend unit), `npm run test:e2e` (browser integration + screenshots)  
**Target Platform**: Desktop web app with local backend API connection  
**Project Type**: Full-stack web application (frontend + backend API)  
**Performance Goals**: Drag preview updates at interactive cadence (<100 ms perceived frame-to-frame), no post-release save-failure regressions, snap correctness on every create/resize outcome  
**Constraints**: Preserve existing timeline time-to-x mapping semantics; apply vertical snap always (4px); horizontal snap only if already present; songs out of scope  
**Scale/Scope**: Single-session timeline editing with hundreds of themes; overlapping vertical stacks in shared time ranges

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first compliance: `spec.md` defines prioritized user stories, measurable outcomes, and explicit constraints.
- [x] Independent value slices: placement semantics (P1), resize controls (P2), and reusable rule consistency (P3) remain independently testable.
- [x] Verification scope: backend contract/integration tests, frontend unit tests, browser integration, and screenshot sanity checks are explicitly planned.
- [x] Dependency execution: backend/frontend runtime and test dependencies are identified and included in quickstart/task flow.
- [x] Test-first workflow: implementation will require failing tests first for placement snapping/drag anchors/resize semantics before code changes.
- [x] Template/script compatibility: no `.specify/scripts/bash/` or `.specify/templates/` modifications required for this feature.
- [x] Full-stack integrity: frontend geometry behavior and backend persistence/validation contract are jointly updated.
- [x] Browser verification: live browser-to-backend flow for create, float stack, and top/bottom resize is required.
- [x] Governance traceability: no constitution amendment needed; current constitution gates are fully applied.

### Post-Design Constitution Check

- [x] Phase 0 research resolved all design decisions without unresolved clarifications.
- [x] `data-model.md`, `contracts/`, and `quickstart.md` are consistent with feature requirements.
- [x] Verification plan includes test-first checks plus screenshot sanity-loop for every changed screen/popup.

## Project Structure

### Documentation (this feature)

```text
/Users/brianandres/Documents/Timeline/specs/005-theme-placement-v2/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── themes-placement-v2-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
/Users/brianandres/Documents/Timeline/backend/
├── src/
│   ├── api/
│   ├── models/
│   ├── repositories/
│   └── services/
└── tests/
    ├── contract/
    └── integration/

/Users/brianandres/Documents/Timeline/frontend/
├── src/
│   ├── components/themes/
│   ├── pages/
│   └── services/themes/
└── tests/
    ├── themes/
    └── timeline/
```

**Structure Decision**: Keep the current backend/frontend split and add a focused
"theme placement geometry" update across existing theme model/API/service and
frontend theme-layer interaction modules.

## Phase 0: Research Plan

1. Finalize snap strategy: one shared 4px vertical snap utility for create and resize previews/commits.
2. Finalize floating geometry representation for persistent theme vertical placement (top and bottom edges independent).
3. Finalize deterministic drag-anchor math for upward vs downward creation.
4. Finalize resize contract for independent top and bottom edge updates plus optional horizontal edge updates.
5. Finalize save-safe geometry normalization strategy to prevent decimal-related failures.

## Phase 1: Design Plan

1. Define persistent theme geometry fields and invariants in `data-model.md`.
2. Define API contract updates in `contracts/themes-placement-v2-api.yaml` including top/bottom geometry fields.
3. Define implementation and verification runbook in `quickstart.md` including screenshot sanity loop.
4. Update Codex agent context by running `/Users/brianandres/Documents/Timeline/.specify/scripts/bash/update-agent-context.sh codex`.

## Complexity Tracking

No constitution violations requiring exceptions.
