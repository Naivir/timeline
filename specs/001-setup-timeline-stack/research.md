# Research: Timeline Foundation

## Decision 1: Backend API style
- Decision: Use a minimal REST API with `GET /api/v1/timeline` and `GET /api/v1/health`.
- Rationale: Read-only timeline bootstrap is sufficient for this phase and keeps
  client integration simple while preserving extension points.
- Alternatives considered:
  - GraphQL endpoint: rejected for MVP because schema/tooling overhead is not
    needed for a single read path.
  - Static file served by frontend: rejected because the feature explicitly
    requires frontend/backend integration.

## Decision 2: Timeline payload shape
- Decision: Return a stable response containing `timeline`, `baseline`,
  `eventPlaceholders`, and `meta`.
- Rationale: Supports current straight-line rendering and future memory marker
  additions without breaking consumer contracts.
- Alternatives considered:
  - Return only a bare line coordinate list: rejected because it lacks semantic
    fields needed for extensibility.
  - Return full future media schema now: rejected due to unnecessary complexity.

## Decision 3: Frontend data-loading pattern
- Decision: Fetch timeline data on page load with explicit `loading`, `ready`,
  and `error` UI states plus a retry action.
- Rationale: Directly satisfies US2/US3 and ensures failure handling is visible
  and testable.
- Alternatives considered:
  - Silent retry without user message: rejected because user would not know why
    content is missing.
  - Block rendering until data arrives: rejected because baseline fallback should
    remain visible and resilient.

## Decision 4: UI foundation choices
- Decision: Use Tailwind utility styles and shadcn/ui primitives for page shell,
  status messaging, and controls; implement timeline line as a simple styled
  horizontal rule/container.
- Rationale: Matches requested stack and leaves room for richer visuals later.
- Alternatives considered:
  - Custom CSS only: rejected because requested UI stack includes Tailwind/shadcn.
  - Heavy animation library now: rejected to keep MVP focused on baseline setup.

## Decision 5: Testing strategy
- Decision: Use layered tests: backend endpoint tests (pytest/httpx), frontend
  component/integration tests (Vitest + RTL), and one browser smoke test
  (Playwright) for end-to-end load and failure state.
- Rationale: Aligns with constitution requirement for verification evidence and
  maps directly to user stories.
- Alternatives considered:
  - Manual-only testing: rejected due to low repeatability.
  - End-to-end-only testing: rejected because debugging failures would be slower.

## Decision 6: Backend dependency workflow
- Decision: Use `uv` for backend environment and dependency management.
- Rationale: `uv` provides fast, reproducible installs and a consistent
  execution path (`uv run pytest`, `uv run uvicorn`) for automated task runs.
- Alternatives considered:
  - `pip` + manual virtualenv management: rejected because dependency setup is
    slower and easier to execute inconsistently across runs.
