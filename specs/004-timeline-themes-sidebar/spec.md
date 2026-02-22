# Feature Specification: Timeline Themes, Sidebar, and Hover UX

**Feature Branch**: `004-timeline-themes-sidebar`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Spec 004: House Keeping: ... New Theme ... toggleable sidebar ..."

## Clarifications

### Session 2026-02-22

- Q: Should Spec 004 include full theme lifecycle (beyond create/resize)? → A: Yes. Include create, select/open details, edit metadata, and delete with safety behavior.
- Q: For deletion safety, should themes (and memories in this spec scope) use confirmation-only delete without undo? → A: Yes. Use confirm-before-delete, and after confirmation delete is final (no undo).
- Q: When overlaps exist, which theme should be selected on click? → A: Select the topmost rendered theme (highest priority; for ties, newest), i.e., the one already visually shown above.
- Q: How should tiny/near-click theme drags be handled? → A: Auto-expand to a fixed minimum duration around the drag target instead of rejecting creation.
- Q: Should memory hover tooltip allow inline edits? → A: No. Tooltip remains preview-only; all edits are done from details/edit surfaces.
- Q: In resize mode, what should clicking an existing memory do, and how is resize mode activated? → A: Resize mode can be activated by holding Shift or using a sidebar resize toggle; releasing Shift exits hold-to-resize mode. In resize mode, clicking memory immediately starts move behavior (no details-open click behavior in that mode).
- Q: For zoom behavior, should vertical and horizontal momentum differ? → A: Restore normal zoom sensitivity; vertical zoom must not continue after gesture stop, while horizontal trackpad zoom may continue briefly (inertial/momentum behavior allowed).
- Q: Should sidebar resize activation be global or split per entity type? → A: Use one global `Resize` toggle in the sidebar that activates resize/move interactions for both themes and memories.
- Q: When delete is triggered from details, should the dedicated delete popup coexist with details or replace it? → A: Open a separate modal popup on top while keeping details visible but non-interactive behind it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster Memory Hover Preview and Confirm Actions (Priority: P1)

As a user, I can quickly preview memory context on hover and confirm destructive actions through compact in-app dialogs.

**Why this priority**: This improves day-to-day usability and prevents accidental destructive actions.

**Independent Test**: Hover over a memory to verify fast tooltip preview; trigger cancel/delete and verify a small in-app confirmation popup appears with explicit confirm/cancel actions.

**Acceptance Scenarios**:

1. **Given** a memory is visible, **When** the user hovers it, **Then** a small tooltip appears within 150 ms showing the title and a short text preview.
2. **Given** a memory has long content, **When** the tooltip appears, **Then** it shows title plus the first 2-4 words of description (or equivalent short preview) without opening the full details panel.
3. **Given** the user triggers memory delete, **When** confirmation is required, **Then** a compact in-app popup appears with options to confirm delete or cancel deletion.
4. **Given** memory delete is confirmed, **When** deletion completes, **Then** it is final with no undo path in this spec scope.
5. **Given** the user is canceling new-memory creation, **When** confirmation is required, **Then** a compact in-app popup appears with options to discard or continue editing.

---

### User Story 2 - Add and Manage Themes Above Timeline (Priority: P1)

As a user, I can create themes by dragging a timeline span above the axis, style them, and manage overlap behavior predictably.

**Why this priority**: Themes are a major new planning/organization layer and must be usable independently of songs.

**Independent Test**: Enter New Theme mode, drag to select a span above the timeline, configure theme fields, save, and verify the rendered theme can be resized by span and height with correct layering behavior.

**Acceptance Scenarios**:

1. **Given** New Theme mode is armed, **When** the user click-drags above the timeline and releases, **Then** a highlighted theme range is created and a theme form opens.
2. **Given** theme form is open, **When** user sets title, tags, description, color, opacity, and priority, **Then** saving persists and renders the theme as a low-opacity block above the timeline.
3. **Given** an existing theme is selected, **When** user drags its horizontal edges, **Then** the time span updates.
4. **Given** an existing theme is selected, **When** user drags vertical edges, **Then** the theme height updates while keeping the theme bottom flush with the timeline.
5. **Given** themes overlap, **When** priorities differ, **Then** higher-priority themes render above lower-priority themes.
6. **Given** themes overlap with equal priority, **When** both are visible, **Then** the later-created theme renders above earlier-created themes.
7. **Given** a theme title does not fit inside its block at current viewport/zoom, **When** rendered, **Then** inline title is hidden and shown on hover instead.
8. **Given** a user clicks an existing theme, **When** selection occurs, **Then** a theme details surface opens and allows edit of metadata fields.
9. **Given** a theme is selected, **When** delete is triggered and confirmed, **Then** the theme is removed with no undo path.
10. **Given** multiple themes overlap at click position, **When** user clicks, **Then** the topmost rendered theme is selected and opened.
11. **Given** a theme drag span is below minimum duration, **When** user releases, **Then** the created theme is auto-expanded to the minimum allowed duration centered on the drag target.
12. **Given** resize mode is active, **When** user hovers a theme edge, **Then** the cursor indicates the matching resize affordance and drag-resize is enabled for top edge (height) and side edges (time span).

---

### User Story 3 - Scalable Navigation UI and Layering Clarity (Priority: P2)

As a user, I can access creation tools from a toggleable top-right sidebar while keeping timeline readability in a denser visual system.

**Why this priority**: As features grow, the top bar must support multiple creation tools without clutter.

**Independent Test**: Open/close the sidebar, launch New Memory and New Theme from it, verify New Songs placeholder is visible but non-functional, and confirm theme/tick/memory layer ordering is visually correct.

**Acceptance Scenarios**:

1. **Given** the timeline page is loaded, **When** user toggles the top-right sidebar, **Then** it reveals actions for New Memory, New Theme, and a disabled placeholder for New Songs.
2. **Given** the timeline is rendered, **When** themes are present, **Then** ticks and labels remain visible above themes, and memories with connector lines remain visible above themes.
3. **Given** timeline space is increased, **When** the page renders, **Then** the vertical interaction area is approximately doubled compared to current baseline without clipping key controls.
4. **Given** user performs vertical zoom gesture, **When** gesture stops, **Then** zoom updates stop immediately with no continued momentum.
5. **Given** user performs horizontal trackpad zoom gesture, **When** gesture stops, **Then** short inertial continuation is allowed.

### Edge Cases

- What happens when a user starts theme drag below the timeline axis?
- What happens when a user drags a zero-width theme range and releases?
- What happens when opacity is set near minimum and theme text contrast is too low?
- What happens when many overlapping themes share the same priority and creation timestamps are very close?
- What happens when the sidebar is open while a create/edit popup is active?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Memory hover MUST show a compact tooltip preview with title and short text snippet.
- **FR-002**: Memory hover tooltip MUST appear within 150 ms of pointer hover on the memory marker.
- **FR-003**: Tooltip snippet MUST display the first 2-4 words of memory description when present; otherwise it MUST show title-only preview.
- **FR-003a**: Memory hover tooltip MUST be preview-only and MUST NOT provide inline edit controls; editing MUST occur through the existing details/edit surface.
- **FR-004**: Cancel and delete flows MUST use compact in-app confirmation popups separate from the full memory editor surface.
- **FR-005**: Delete confirmation popup MUST provide explicit actions for confirm delete and cancel.
- **FR-006**: Cancel-new-memory confirmation popup MUST provide explicit actions for discard and continue editing.
- **FR-007**: Timeline vertical interactive region MUST be expanded to roughly 2x current baseline height while keeping timeline axis visually centered.
- **FR-008**: UI MUST provide a toggleable sidebar control in the top-right area.
- **FR-009**: Sidebar MUST include actions for `New Memory`, `New Theme`, and a visible `New Songs` placeholder control.
- **FR-010**: `New Songs` placeholder MUST be non-functional in this feature and clearly indicated as unavailable.
- **FR-011**: Entering `New Theme` mode MUST change cursor affordance to indicate placement mode.
- **FR-012**: Theme creation MUST require click-drag-release gesture above the timeline to define [start, end] time span.
- **FR-013**: Releasing a valid theme drag selection MUST open a theme editor popup.
- **FR-014**: Theme editor MUST capture title, tags, description, color, opacity, and priority (integer 0-1000).
- **FR-015**: Theme records MUST be stored as a distinct backend entity from memories.
- **FR-016**: Themes MUST render only above the timeline axis; songs are out of scope for rendering below axis.
- **FR-017**: Themes MUST render with low opacity by default and allow user-controlled opacity adjustment.
- **FR-018**: Theme bottom edge MUST remain flush to timeline axis at all times.
- **FR-019**: Theme horizontal edge drag MUST resize time span without breaking axis alignment.
- **FR-020**: Theme vertical edge drag MUST resize theme height while preserving bottom flush alignment to axis.
- **FR-021**: Overlapping theme render order MUST be determined first by higher priority value.
- **FR-022**: For equal-priority overlaps, later-created theme MUST render above earlier-created theme.
- **FR-023**: Timeline ticks/labels MUST render above theme layers.
- **FR-024**: Memory markers and connector lines MUST render above theme layers.
- **FR-025**: Theme title MUST render centered both horizontally and vertically inside the theme when space allows.
- **FR-026**: If centered title cannot fit in current viewport/zoom, inline title MUST be hidden and shown on hover tooltip instead.
- **FR-027**: Theme and memory interactions MUST preserve existing timeline pan/zoom semantics.
- **FR-028**: Sidebar and popups MUST not obscure core timeline interactions more than necessary and MUST remain dismissible.
- **FR-029**: Clicking an existing theme MUST open a details surface for that theme.
- **FR-030**: Theme details MUST support editing of title, tags, description, color, opacity, and priority after creation.
- **FR-031**: Users MUST be able to delete a selected theme via an explicit action in the theme details surface.
- **FR-032**: Theme delete MUST require confirmation and, once confirmed, MUST be final (no undo).
- **FR-033**: Memory delete in this feature scope MUST require confirmation and, once confirmed, MUST be final (no undo).
- **FR-034**: When multiple themes overlap, click-selection MUST target the topmost rendered theme according to overlap order rules (`priority` then creation recency).
- **FR-035**: Theme creation MUST enforce a minimum duration; if drag span is below the minimum, the persisted range MUST auto-expand to that minimum around the user’s drag target.
- **FR-036**: Delete confirmation MUST appear as its own dedicated modal/popup layer and MUST NOT be rendered as an expanded region inside the existing details/editor panel.
- **FR-036a**: When delete confirmation is open, the underlying details panel MAY remain visible for context but MUST be non-interactive until the modal is closed.
- **FR-037**: The UI MUST provide a resize mode that can be activated by either holding `Shift` or toggling a dedicated resize control in the sidebar.
- **FR-037a**: The sidebar resize control MUST be a single global `Resize` toggle that applies to both theme and memory resize/move interactions.
- **FR-038**: When `Shift` is used as the activation method, releasing `Shift` MUST immediately exit hold-to-resize mode.
- **FR-039**: In resize mode, clicking a memory marker MUST start reposition behavior (horizontal and vertical move) instead of opening details; outside resize mode, normal selection/details behavior remains unchanged.
- **FR-040**: In resize mode, theme resizing MUST be edge-activated: hovering near top edge enables height resize, and hovering near left/right edges enables horizontal span resize.
- **FR-041**: Zoom sensitivity MUST be restored to the prior baseline used before this branch’s regressions.
- **FR-042**: Vertical zoom input (pinch/wheel vertical) MUST stop immediately when user input stops (no post-stop momentum continuation).
- **FR-043**: Horizontal trackpad zoom MAY retain brief inertial continuation after input stops.
- **FR-044**: In resize mode, themes MUST expose corner resize affordances (top-left/top-right) that support simultaneous height and horizontal-span adjustment in one drag gesture.
- **FR-045**: In resize mode, memory repositioning MUST update continuously while dragging (not only on pointer release) so the marker tracks the cursor.
- **FR-046**: In resize mode, hover preview tooltips/titles for both memories and themes MUST be suppressed to reduce interaction noise during direct manipulation.
- **FR-047**: Exiting resize mode MUST NOT auto-open details/edit panels for the currently selected memory or theme; resize-target selection MUST be cleared on resize-mode exit.
- **FR-048**: Exiting hold-to-resize via `Shift` release MUST clear active resize-target selection before resize mode is disabled so no details panel appears even momentarily.
- **FR-049**: Trackpad zoom-in/out MUST remain functional and perceptibly responsive after resize-mode changes; momentum suppression rules apply only to inertial vertical tails, not active zoom input.
- **FR-050**: Pressing `Shift` while focus is inside memory/theme editing inputs MUST NOT enter hold-to-resize mode; text-entry keyboard usage takes precedence.

## Constitution Alignment *(mandatory)*

- **CA-001 Spec-First**: This spec must produce `plan.md` and `tasks.md` in `specs/004-timeline-themes-sidebar/` before implementation.
- **CA-002 Independent Slices**: Story 1 (hover/confirm), Story 2 (theme creation/edit), and Story 3 (sidebar/layering) are independently implementable and testable.
- **CA-003 Verification Scope**: Verification must include unit and browser tests for tooltip timing/content, confirmation popups, theme drag-create/edit, overlap ordering, and layer ordering.
- **CA-004 Compatibility Impact**: Contracts, data model, quickstart, and agent workflow docs must stay synchronized with theme entity and visual sanity-check workflow.

## Assumptions

- The unfinished phrase for New Songs placeholder is interpreted as a visible disabled control for future feature scope.
- Theme drag-creation starts only in the region above the timeline axis.
- Existing memory creation/edit/delete behavior remains supported while introducing theme features.

## Out of Scope

- Full New Songs workflow, persistence model, and rendering below timeline.
- Automated color palette generation beyond user-chosen color.
- Collaboration, sharing, permissions, and multi-user conflict handling.

### Key Entities *(include if feature involves data)*

- **Theme**: A timeline-attached, above-axis visual range with start/end time, title, tags, description, color, opacity, priority, height, and creation ordering metadata.
- **ThemeLayerOrder**: Derived ordering mechanism using priority and creation order to resolve visual stacking.
- **MemoryHoverPreview**: Lightweight hover state containing memory title and short snippet content.
- **ActionSidebarState**: Open/closed state and action availability for New Memory, New Theme, and New Songs placeholder.
- **ConfirmationPopupState**: State machine for compact confirm dialogs used by delete and cancel-destructive flows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of hover attempts display memory preview tooltip within 150 ms.
- **SC-002**: 100% of delete and cancel-destructive actions require explicit in-app confirmation and complete correct outcome (confirm vs cancel).
- **SC-003**: 95% of users can create and save a theme range above the timeline in under 30 seconds without guidance.
- **SC-004**: 100% of overlap cases render correct theme stacking by priority, with equal-priority ties resolved by creation recency.
- **SC-005**: 100% of rendered scenes preserve visual layer order: themes below ticks/labels and below memories/connectors.
- **SC-006**: 95% of usability-test participants rate navigation controls (sidebar + creation actions) as clear and discoverable.
