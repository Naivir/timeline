# Research: Timeline Memory Interactions

## Decision 1: Persist memory session data in backend relational DB with repository abstraction
- Decision: Use backend relational persistence as canonical source for memory session data, with repository/service separation.
- Rationale: Meets explicit persistence requirement, supports deterministic read/write behavior, and keeps domain logic testable.
- Alternatives considered:
  - In-memory backend store only: rejected because data would be lost between sessions.
  - Frontend-only local storage: rejected because backend DB persistence is now required.

## Decision 2: Support point and range anchors as a single memory resource type
- Decision: Model memory with a discriminated temporal anchor (`point` or `range`) under one API resource.
- Rationale: Keeps operations uniform (create/edit/delete/select) while supporting both temporal forms.
- Alternatives considered:
  - Separate point/range endpoints and models: rejected due to duplicated validation and edit semantics.

## Decision 3: Delete safety via undo window endpoint
- Decision: Implement delete as reversible action with undo capability within a bounded window.
- Rationale: Aligns with flow-first UX and avoids modal-heavy interruption while satisfying reversible destructive actions.
- Alternatives considered:
  - Confirmation-only modal: rejected as higher interruption for repeated workflows.
  - Hard delete without undo: rejected because it violates safety requirement.

## Decision 4: Deterministic density simplification derived from timeline state
- Decision: Compute simplified memory presentation mode from memory count + zoom band deterministically; do not mutate memory data.
- Rationale: Ensures reversibility and stable behavior across pan/zoom while preserving source data.
- Alternatives considered:
  - Randomized collision handling: rejected as non-deterministic.
  - Permanent aggregation writes to DB: rejected because view logic must not alter canonical memory data.

## Decision 5: Interaction arbitration between timeline and memories via explicit hit-target ownership
- Decision: Empty timeline drags pan; selected memory marker/range handle drags edit anchor; non-target pointer movement never captures edit mode.
- Rationale: Prevents gesture hijacking and preserves timeline semantics.
- Alternatives considered:
  - Global drag mode toggle: rejected as high-friction for primary interactions.

## Decision 6: Local development DB choice
- Decision: Use SQLite as default local backend DB for this feature while keeping schema portable.
- Rationale: Fast setup, no external service requirement, compatible with CI/local verification.
- Alternatives considered:
  - PostgreSQL-only local requirement: rejected due to heavier setup for early feature iteration.

## Decision 7: Verification strategy
- Decision: Require backend API tests for CRUD/undo rules and browser tests against live backend for create/edit/delete + timeline interaction independence.
- Rationale: Satisfies constitution test-first + browser verification gates and validates cross-layer contracts.
- Alternatives considered:
  - Unit tests only: rejected due to insufficient validation of frontend/backend integration behavior.
