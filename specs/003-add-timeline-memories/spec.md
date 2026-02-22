# Feature Specification: Timeline Memory Interactions

**Feature Branch**: `003-add-timeline-memories`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "make 003 feature - Goal Define the behavior, interaction model, and baseline visual/UX requirements for time-attached memories displayed on a timeline."

## Clarifications

### Session 2026-02-22

- Q: Should the spec be aligned to the full bug/update list including truncated items, interaction bugs, and verification workflow gaps? → A: Yes; include full update list, enforce click-to-place with horizontal and vertical placement fidelity, open editor on create, guarantee click-to-open on memory icon, and add mandatory screenshot-based visual sanity check after each UI change.
- Q: Should memory classification be single-value or multi-value? → A: Multi-value tags (`tags: string[]`), edited as comma-separated text in the UI.
- Q: What should happen when user clicks Cancel during initial memory creation? → A: Show a confirmation prompt and, if confirmed, discard the new memory entirely (no draft state).
- Q: Where and how large should the memory details editor appear? → A: Centered modal dialog, large but responsive (`min(920px, 92vw)` max width, constrained max height with internal scroll).
- Q: How much should zoom be slowed? → A: Moderately slower zoom, targeting about 5% scale change per wheel notch.
- Q: How should wheel/trackpad zoom momentum behave by axis? → A: Vertical zoom (wheel/pinch) must stop when user input stops (no inertial tail), while horizontal trackpad zoom should retain inertial continuation after input ends.
- Q: What confirmation UI is required for destructive actions? → A: Use only custom in-app confirmation dialogs; browser-native confirm/alert dialogs are not allowed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Inspect Memories (Priority: P1)

As a user, I can create a memory anchored to time and inspect its details without
losing timeline context.

**Why this priority**: Creating and inspecting memories is the core value of the
feature and must work before advanced editing and density handling.

**Independent Test**: Arm placement from the "New Memory" action and place via
click on the timeline, then verify the memory appears at the expected time,
becomes selected, and opens an editable details surface while the timeline
stays usable.

**Acceptance Scenarios**:

1. **Given** the timeline is visible, **When** the user clicks an empty position
   on the timeline while placement mode is armed, **Then** a new point memory is
   created at that time and at the clicked vertical lane/offset, displayed with
   the memory marker style, and selected.
2. **Given** the user activates the "New Memory" action, **When** the timeline
   enters placement mode and the user clicks a timeline position, **Then** a
   memory is created at the clicked time and shown on the timeline.
3. **Given** a memory is newly created, **When** the details surface opens,
   **Then** title and description fields are immediately editable while the
   timeline remains visible.
4. **Given** the user clicks Cancel during initial creation editing,
   **When** cancellation is confirmed, **Then** the just-created memory is
   removed from timeline and backend state.
5. **Given** an existing memory is selected, **When** the details surface
   opens, **Then** metadata and temporal anchor are visible, and an explicit
   edit action allows returning to the editable form.
6. **Given** a point memory is displayed, **When** rendered,
   **Then** it appears as a book-style icon in a square marker with a vertical
   connector line to the timeline axis, with connector length derived from the
   memory's vertical offset.

---

### User Story 2 - Edit Memory Time and Metadata (Priority: P2)

As a user, I can edit memory content and temporal anchors through direct
manipulation so memories stay accurate as I navigate time.

**Why this priority**: Editing is required for long-term usefulness and ensures
users can correct or refine memories after creation.

**Independent Test**: Select an existing point and range memory, update fields,
move anchors by drag interactions, and verify immediate visual updates aligned
with the timeline coordinate mapping.

**Acceptance Scenarios**:

1. **Given** a point memory is selected, **When** the user drags its marker,
   **Then** its timestamp updates and marker position follows continuously.
2. **Given** a range memory is selected, **When** the user drags the range body,
   **Then** start and end move together and remain aligned to the timeline.
3. **Given** a range memory is selected, **When** the user drags a range handle,
   **Then** only the corresponding start or end is adjusted.
4. **Given** memory fields are edited in details,
   **When** changes are made, **Then** UI updates immediately and remains
   visually consistent through pan/zoom interactions.

---

### User Story 3 - Delete Safely and Preserve Interaction Quality (Priority: P3)

As a user, I can delete memories safely and continue using the timeline even in
dense views without losing control.

**Why this priority**: Safe deletion and deterministic density behavior reduce
user risk and keep the interface usable as memory count grows.

**Independent Test**: Delete a selected memory and recover it through undo,
then verify dense timelines simplify memory visuals deterministically while data
and interaction semantics remain intact.

**Acceptance Scenarios**:

1. **Given** a memory is selected, **When** delete is triggered,
   **Then** the UI provides a reversible path via undo.
2. **Given** delete is completed, **When** undo is invoked,
   **Then** the deleted memory is restored with its prior temporal anchor and
   metadata.
3. **Given** memory density increases at low zoom levels,
   **When** simplification is applied, **Then** rendering uses deterministic,
   reversible aggregation indicators without changing memory data.
4. **Given** memory overlays are present,
   **When** the user drags on empty timeline space, **Then** timeline pan/zoom
   behaviors remain unchanged.

### Edge Cases

- What happens when a memory is created at the exact same timestamp as another memory?
- What happens when a range memory start and end are moved to the same time?
- How does the UI behave when a selected memory scrolls out of view during pan/zoom?
- What happens when delete is invoked and the undo window expires?
- How does the system display very dense memory regions while keeping selections deterministic?
- What happens when a drag edit is interrupted before release?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST represent memories as items with unique ID,
  temporal anchor (point or range), required non-empty title, optional
  description/body text, and optional `tags` list (zero or more strings).
- **FR-002**: Memory positioning MUST be derived exclusively from the timeline
  time-to-horizontal-position coordinate mapping.
- **FR-003**: Point memories MUST render as timeline-aligned markers and range
  memories MUST render as spans aligned by start and end anchors.
- **FR-004**: Point memory visuals MUST include a book-style icon in a square
  marker with a vertical connector line to the timeline axis.
- **FR-004a**: Memory placement from timeline click MUST preserve both
  horizontal (time anchor) and vertical (visual lane/offset) click intent.
- **FR-004b**: Re-rendering during pan/zoom MUST preserve stored vertical
  placement offsets and keep connector geometry aligned to the timeline axis.
- **FR-005**: Memory positions MUST update continuously during timeline pan/zoom
  and remain deterministic for the same time, zoom, and viewport.
- **FR-006**: Hovering a memory MUST provide subtle highlight and lightweight
  preview without modifying timeline state.
- **FR-007**: Clicking a memory MUST select it; only one memory may be selected
  at a time.
- **FR-008**: Selection state MUST persist across pan/zoom until explicitly
  changed by user action.
- **FR-009**: Selecting a memory MUST open a details surface showing editable
  memory fields while keeping the timeline visible and usable.
- **FR-009a**: Left-clicking a memory icon MUST reliably open details for that
  memory and MUST NOT be blocked by overlapping decorative layers.
- **FR-010**: Users MUST be able to create memories via a primary "New Memory"
  action that arms placement mode and a contextual timeline click entry point.
- **FR-011**: Timeline-context creation MUST default to a point memory anchored
  to clicked time once placement mode is active.
- **FR-011a**: The "New Memory" action MUST only arm placement mode; memory
  creation MUST occur only after the subsequent timeline click.
- **FR-011b**: Immediately after memory creation, the details surface MUST open
  in edit mode with title and description inputs focused and ready for entry.
- **FR-011c**: If user cancels initial creation, UI MUST present a confirmation
  prompt; upon confirmation, the newly created memory MUST be deleted
  immediately with no draft retained.
- **FR-012**: Users MUST be able to convert a point memory to a range memory
  during creation or editing.
- **FR-013**: Users MUST be able to edit title, description/body text,
  tags, and temporal anchor.
- **FR-013a**: Details view labels MUST use `Tags` (not `Type`) and support
  editing/display of multiple tags.
- **FR-014**: Temporal edits MUST support direct manipulation: point marker drag,
  range body drag, and range handle drag.
- **FR-015**: Memory edit visuals MUST update immediately in the interface.
- **FR-016**: Users MUST be able to delete a selected memory from the details
  surface.
- **FR-016a**: Details view MUST expose a clearly visible delete action for the
  selected memory.
- **FR-016b**: Delete and discard confirmations MUST use custom in-app modal
  UI and MUST NOT rely on browser-native dialogs.
- **FR-017**: Delete actions MUST be reversible through an undo affordance.
- **FR-018**: Memory overlays MUST not hijack timeline pan/zoom semantics:
  dragging empty timeline pans, while dragging selected memory elements edits
  memory anchors.
- **FR-019**: At low zoom or high density, memory rendering MAY simplify using
  deterministic aggregation indicators while preserving underlying memory data.
- **FR-020**: Density simplification behavior MUST be reversible as zoom changes.
- **FR-021**: The interface MUST include a persistent header with app/title area
  and a primary "New Memory" action.
- **FR-022**: The header MUST be visually distinct from page background via tint,
  divider, shadow, or equivalent visual separation.
- **FR-022a**: The header and timeline layout MUST avoid overlap at supported
  viewport sizes so the title/actions do not obscure timeline interactions.
- **FR-023**: Memory details surfaces MUST use a card/panel treatment with clear
  hierarchy, comfortable spacing, and readable contrast.
- **FR-023a**: The memory details/edit surface MUST open centered in the
  viewport as a large responsive modal dialog (target max-width equivalent to
  `min(920px, 92vw)`), with bounded height and internal scrolling when needed.
- **FR-023b**: Details layout MUST place metadata summary fields near the
  footer area, with `Tags` bottom-left and timestamp adjacent in the lower
  metadata row.
- **FR-023c**: Timestamps shown in details UI MUST be human-friendly
  formatted text, not raw ISO strings.
- **FR-024**: Hover, selection, and details-surface transitions MUST be smooth
  and must not cause positional drift or desynchronization.
- **FR-025**: Selection and highlight states MUST remain clearly identifiable
  without relying solely on color.
- **FR-026**: Memory operations MUST function without assuming backend
  synchronization or authentication, and MUST persist session memory data in the
  backend database when create/edit/delete actions are committed.
- **FR-027**: Memory interactions MUST consume the timeline mapping as source of
  truth and MUST NOT alter timeline coordinate semantics.
- **FR-028**: Timeline zoom sensitivity MUST be reduced to a moderate step
  target (~5% scale change per wheel notch / equivalent pinch delta).
- **FR-028a**: Vertical zoom input MUST NOT apply inertial tail behavior after
  direct user input stops.
- **FR-028b**: Horizontal trackpad zoom input SHOULD preserve inertial
  continuation to maintain fluid left/right zooming.

## Constitution Alignment *(mandatory)*

- **CA-001 Spec-First**: This feature produces `plan.md` and `tasks.md` for
  `specs/003-add-timeline-memories/` with no unresolved blockers.
- **CA-002 Independent Slices**: Stories are independently testable and deliver
  value in sequence: create/inspect, edit, then delete+density safety.
- **CA-003 Verification Scope**: Verification includes automated browser tests
  for creation, selection/details, direct manipulation edits, safe delete/undo,
  and timeline gesture independence.
- **CA-003a Visual Sanity Check**: After each UI change, verification MUST
  include a captured screenshot plus explicit manual visual review ("vibe
  check") to catch layout and interaction regressions not covered by assertions.
- **CA-003a.1 Iterative Visual/Test Loop**: Visual defects discovered in
  screenshots MUST be converted into failing automated tests before fixes are
  accepted; the team MUST rerun tests and re-capture/re-review screenshots
  until no visual regressions remain.
- **CA-003b Test Correctness Rule**: Browser tests MUST assert real user-critical
  outcomes (icon click opens details, create opens edit mode, non-overlap
  layout, placement fidelity) and MUST avoid false positives caused by overly
  mocked flows that skip the interaction under test.
- **CA-003c Confirmation UX Validation**: Browser tests MUST verify custom
  in-app confirmation dialogs for delete/discard flows and MUST NOT depend on
  browser-native dialog handlers.
- **CA-004 Compatibility Impact**: Contracts and quickstart docs under
  `specs/003-add-timeline-memories/` MUST stay synchronized with interaction
  requirements and density behavior decisions.

## Assumptions

- Memory creation/edit flows are single-user and local-session scoped for this
  feature.
- Keyboard shortcuts are optional except where explicitly requested later.
- The details surface may be panel or popover as long as timeline visibility and
  usability are preserved.
- Dense-state aggregation uses deterministic visual indicators without defining a
  final visual style system for clustering.

## Out of Scope

- Multi-user collaboration, shared editing, or live presence indicators.
- Search, filtering, and advanced grouping beyond deterministic density
  simplification.
- Synchronization, offline storage, authentication, and authorization behavior.
- Rich media rendering behavior beyond placeholder memory type representation.

### Key Entities *(include if feature involves data)*

- **Memory**: A user-authored timeline item with ID, temporal anchor,
  title, optional description, and optional tags.
- **TemporalAnchor**: Either a single timestamp or a bounded range
  (`start`, `end`) used for positioning.
- **MemorySelectionState**: Tracks currently selected memory and selection
  persistence rules across timeline navigation.
- **MemoryDetailsSurface**: The inspect/edit surface for selected memory fields
  and destructive actions.
- **DensityPresentationState**: Derived display mode used to simplify rendering
  under high density while preserving determinism and data fidelity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of test participants can create and select a point memory in
  under 20 seconds without guidance.
- **SC-002**: 100% of repeated pan/zoom operations maintain deterministic memory
  alignment for identical timeline state inputs.
- **SC-003**: 95% of edit interactions (metadata and temporal drag edits) are
  completed successfully on first attempt.
- **SC-004**: 100% of delete operations are reversible via undo within the
  defined undo window.
- **SC-005**: 95% of users can identify selected memory state correctly without
  relying on color-only cues.
- **SC-006**: 100% of density simplification transitions are reversible across
  zoom changes without mutating memory data.
- **SC-007**: 95% of users rate the memory timeline experience as clear and
  visually coherent in usability validation.
