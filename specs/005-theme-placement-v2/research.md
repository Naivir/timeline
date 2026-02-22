# Research: Theme Placement v2 (Snapping + Floating + Deterministic Drag Anchors)

## Decision 1: Use a single 4px vertical snap function for create preview, create commit, resize preview, and resize commit
- Decision: Define one canonical vertical snap rule (`round to nearest 4px`) and apply it everywhere themes are visually previewed or persisted.
- Rationale: Prevents preview/commit mismatch and removes edge drift between create and resize flows.
- Alternatives considered:
  - Snap only on pointer-up: rejected because live preview can disagree with final result.
  - Different snap behavior for create vs resize: rejected due to unpredictability.

## Decision 2: Persist floating theme geometry as independent top/bottom vertical positions
- Decision: Persist two vertical geometry values (`top` and `bottom`, expressed in the same coordinate space used by the timeline surface) instead of baseline+height only.
- Rationale: Directly models floating themes and allows independent top/bottom edge resize without implicit anchoring assumptions.
- Alternatives considered:
  - Keep baseline + height only: rejected because it prevents true floating and independent bottom-edge control.
  - Store only height with transient top: rejected due to lossy round-trips.

## Decision 3: Deterministic drag-anchor semantics are encoded from pointer-down + drag direction
- Decision: Pointer-down always sets left edge. On pointer-up, upward drag sets pointer-down as bottom-left, downward drag sets pointer-down as top-left.
- Rationale: Matches spec exactly and remains easy to explain and test.
- Alternatives considered:
  - Use min/max Y only (direction-agnostic): rejected because it ignores required anchor semantics.
  - Anchor on pointer-up: rejected because it breaks determinism.

## Decision 4: Keep timeline time-to-x mapping unchanged and treat horizontal snap as conditional
- Decision: Preserve current time mapping and only apply horizontal 4px snap when horizontal pixel snapping is already active in current code paths.
- Rationale: Satisfies requirement to avoid introducing new time logic while keeping snap behavior consistent where already present.
- Alternatives considered:
  - Introduce mandatory new horizontal snapping: rejected as scope expansion and potential timeline behavior regression.

## Decision 5: Remove manual numeric height editing from theme edit UI in this feature
- Decision: Disable/remove manual height numeric entry for themes and keep height adjustments drag-driven.
- Rationale: Simplest reliable way to prevent decimal-entry save failures and align with direct-manipulation UX.
- Alternatives considered:
  - Keep numeric edit and normalize every input path: rejected as broader validation surface for this release.

## Decision 6: Reusable placement engine is a pure geometry module consumed by theme layer
- Decision: Extract/expand a pure geometry utility responsible for snap, anchor, and edge calculations; UI components consume it.
- Rationale: Supports future song-block reuse without implementing songs now.
- Alternatives considered:
  - Keep math inline in React components: rejected due to duplication and lower testability.

## Decision 7: Verification uses test-first and mandatory screenshot sanity loop per changed screen/popup
- Decision: For each changed create/resize/details state, capture screenshot, manually review, encode discovered defects into failing automated tests, then fix and recapture.
- Rationale: Required by constitution and specifically requested workflow for this repository.
- Alternatives considered:
  - Assertions-only tests with no screenshot review: rejected due to visual regression blind spots.
