# Implementation Plan: Timeline Themes, Sidebar, and Hover UX

**Branch**: `004-timeline-themes-sidebar` | **Date**: 2026-02-22 | **Spec**: `/Users/brianandres/Documents/Timeline/specs/004-timeline-themes-sidebar/spec.md`
**Input**: Feature specification from `/specs/004-timeline-themes-sidebar/spec.md`

## Summary

Implement three coordinated upgrades to the timeline product surface: (1) faster
memory hover preview and compact confirmation popups, (2) a new above-axis
Theme entity with drag-create/edit and deterministic overlap ordering, and (3) a
scalable top-right action sidebar with New Memory/New Theme plus a disabled New
Songs placeholder. Delivery spans backend persistence/contracts and frontend
interaction/rendering while preserving existing timeline pan/zoom semantics.

## Technical Context

**Language/Version**: Python 3.13 (backend), TypeScript 5.x (frontend)  
**Primary Dependencies**: FastAPI, Pydantic/SQLModel/SQLAlchemy, Uvicorn, React 18, Vite, Radix UI, Vitest, Playwright  
**Storage**: Backend relational DB (SQLite for local dev, portable schema)  
**Testing**: pytest (backend), Vitest + React Testing Library (frontend unit), Playwright (browser integration + visual screenshot sanity checks)  
**Target Platform**: Desktop web browsers with local HTTP API backend  
**Project Type**: Web application (frontend + backend API)  
**Performance Goals**: Hover preview visible <=150 ms; interactive drag/resize updates perceived smooth (<100 ms feedback cadence local dev); timeline remains visually stable with doubled vertical space  
**Constraints**: Themes render above timeline only; ticks and memories render above themes; overlap order uses `priority` then creation recency; compact confirm dialogs must be in-app; New Songs remains placeholder-only in this feature  
**Scale/Scope**: Single-session workflows with hundreds to low-thousands of memories/themes and frequent overlap scenarios

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first compliance: `spec.md` defines prioritized stories, constraints,
      and measurable outcomes.
- [x] Independent value slices: Story 1 (hover/confirm), Story 2 (themes), Story
      3 (sidebar/layering) are independently testable and valuable.
- [x] Verification scope: backend, frontend unit, browser integration, and
      screenshot sanity checks are explicitly planned.
- [x] Dependency execution: backend/frontend dependency install steps are included
      in quickstart and expected task flow.
- [x] Test-first workflow: failing tests for each story are required before
      implementation.
- [x] Template/script compatibility: no `.specify` template/script changes are
      required for this feature.
- [x] Full-stack integrity: explicit API contracts and DB model changes are
      planned for themes and interactive flows.
- [x] Browser verification: at least one live browser-to-backend test path is
      required for theme create/edit/overlap and memory hover/confirm flows.
- [x] Governance traceability: no constitution amendment required; this plan
      follows current mandatory visual sanity workflow.

### Post-Design Constitution Check

- [x] Research resolves all planning ambiguities and records deterministic
      decisions.
- [x] Data model, contracts, and quickstart remain aligned with spec behavior.
- [x] Cross-layer verification strategy covers backend contract + browser
      interaction correctness + screenshot sanity checks.

## Project Structure

### Documentation (this feature)

```text
specs/004-timeline-themes-sidebar/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── themes-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── models/
│   ├── repositories/
│   └── services/
└── tests/
    ├── contract/
    └── integration/

frontend/
├── src/
│   ├── components/
│   │   ├── memories/
│   │   ├── themes/
│   │   └── layout/
│   ├── pages/
│   └── services/
│       ├── memories/
│       └── themes/
└── tests/
    ├── memories/
    ├── themes/
    └── timeline/
```

**Structure Decision**: Keep existing frontend/backend split and add a dedicated
`themes` module on both layers, plus shared layout/sidebar updates in frontend.

## Phase 0: Research Plan

1. Resolve hover preview behavior details (timing threshold and snippet rules)
   and confirmation dialog behavior boundaries.
2. Resolve theme geometry semantics: above-axis anchoring, height defaults,
   drag-resize constraints, and zero-width selection policy.
3. Resolve deterministic overlap ordering strategy using `priority` + creation
   recency.
4. Resolve visual layer ordering guarantees (themes below ticks/memories).
5. Resolve sidebar interaction expectations while preserving timeline usability
   and future New Songs extensibility.

## Phase 1: Design Plan

1. Define theme persistence and view entities in `data-model.md` including
   layering metadata and validation rules.
2. Define backend HTTP contract in `contracts/themes-api.yaml` for theme
   create/read/update/delete and drag-resize updates.
3. Define development/verification flow in `quickstart.md` including screenshot
   sanity-loop steps.
4. Update Codex context via `.specify/scripts/bash/update-agent-context.sh codex`.

## Complexity Tracking

No constitution violations requiring exceptions.
