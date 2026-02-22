# Feature Specification: Theme Placement v2

**Feature Branch**: `005-theme-placement-v2`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Theme Placement v2 (Snapping + Floating + Deterministic Drag Anchors)"

## Clarifications

### Session 2026-02-22

- Q: Can themes be placed anywhere vertically, or must they stay above the timeline axis? → A: Themes must remain above the timeline axis.
- Q: How should bottom corner handles behave? → A: Bottom corners are dual-axis handles: bottom-left adjusts start+bottom, bottom-right adjusts end+bottom, top stays fixed.
- Q: How should vertical theme move in resize mode affect geometry? → A: Vertical move is pure translation; duration and height remain fixed.
- Q: What should the exact title display priority be for themes as size changes? → A: Show full title if it fits; else show abbreviated title if it fits; else hide in-block and show on hover tooltip.
- Q: How should the new abbreviated title value be sourced and stored? → A: Add optional abbreviatedTitle field; if empty, do not auto-generate a short title.
- Q: What length constraint should abbreviatedTitle use? → A: No additional length limit beyond existing title limits.
- Q: Which concrete visibility rule should we use for full vs abbreviated title display? → A: No horizontal minimum pixel threshold; use measured horizontal text fit. Reduce current vertical gating for full title. Abbreviated title fallback is horizontal-fit driven only (not vertical-height driven).
- Q: What exact minimum height should full-title display require? → A: 16px including border and padding.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Place Floating Theme Blocks Precisely (Priority: P1)

As a timeline editor, I can place a theme by click-dragging a rectangle with deterministic anchor behavior and 4px vertical snapping.

**Why this priority**: Precise initial placement is the core workflow that unlocks all other theme editing behavior.

**Independent Test**: Enter theme placement mode, drag downward and upward in separate attempts, and verify left edge, drag-direction anchoring, and 4px vertical snapping are consistently applied.

**Acceptance Scenarios**:

1. **Given** theme placement mode is active, **When** the user mouse-downs at point A and drags right/down to point B then releases, **Then** the new theme uses A as the top-left anchor, uses release X as right edge, and snaps top/bottom edges to 4px vertical increments.
2. **Given** theme placement mode is active, **When** the user mouse-downs at point A and drags right/up to point B then releases, **Then** the new theme uses A as the bottom-left anchor, uses release X as right edge, and snaps top/bottom edges to 4px vertical increments.
3. **Given** an existing theme already occupies the same time slice, **When** a second theme is placed above it, **Then** both themes remain independently positioned without forced baseline alignment.

---

### User Story 2 - Resize Theme with Independent Top and Bottom Control (Priority: P2)

As a timeline editor, I can resize theme top and bottom edges independently, with visible snapped results.

**Why this priority**: Resizing is essential to refine placed themes and must remain predictable at pixel level.

**Independent Test**: Select an existing theme, drag top handle, then bottom handle, and verify each edge moves independently and snaps on 4px increments.

**Acceptance Scenarios**:

1. **Given** a selected theme, **When** the user drags the top handle, **Then** only the top edge changes while the bottom edge remains fixed and the visible edge lands on 4px grid increments.
2. **Given** a selected theme, **When** the user drags the bottom handle, **Then** only the bottom edge changes while the top edge remains fixed and the visible edge lands on 4px grid increments.
3. **Given** a theme has been resized, **When** the user saves subsequent edits, **Then** save succeeds and no decimal-related validation failure occurs.
4. **Given** resize mode is active, **When** the user drags a theme bottom-left corner, **Then** the theme start edge and bottom edge update together with 4px vertical snapping while top edge remains fixed.
5. **Given** resize mode is active, **When** the user drags a theme bottom-right corner, **Then** the theme end edge and bottom edge update together with 4px vertical snapping while top edge remains fixed.
6. **Given** resize mode is active, **When** the user drags a theme body vertically, **Then** the theme moves vertically within the above-axis region and does not cross below the timeline axis.
7. **Given** resize mode is active, **When** the user drags a theme body vertically, **Then** theme duration and height remain unchanged during the move.

---

### User Story 3 - Use Consistent Placement Rules for Future Reuse (Priority: P3)

As a product team, we can reuse a single theme placement/resizing rule set for future timeline block types without changing current user behavior.

**Why this priority**: Reusable rules reduce future rework while keeping this release scoped to themes only.

**Independent Test**: Validate that placement and resizing interactions use one consistent rule set across create and edit flows, with no separate conflicting behavior paths.

**Acceptance Scenarios**:

1. **Given** create and resize interactions for themes, **When** users perform repeated edits, **Then** snapping, anchoring, and edge semantics remain consistent in every flow.
2. **Given** future block types are out of scope, **When** planning artifacts are reviewed, **Then** they show reusable placement rules defined for themes without requiring song implementation in this feature.

---

### Edge Cases

- Drag started and released with near-zero width: system prevents invalid zero-width theme creation and preserves current editing state.
- Drag started and released with near-zero height: system either rejects creation with clear feedback or normalizes to minimum valid snapped height.
- Drag direction reversal during in-progress drag: preview updates continuously and final rectangle honors the final pointer direction at release.
- Theme placement near viewport bounds: snapped placement remains within allowed timeline drawing region.
- Theme placement crossing below axis during drag: preview and commit are constrained to remain above the timeline axis.
- Existing horizontal snapping absent: vertical snapping still applies at 4px, with no new horizontal time logic introduced.
- Resizing across opposite edge (top dragged below bottom or bottom dragged above top): system prevents inversion or normalizes safely while preserving deterministic behavior.
- Vertical move in resize mode attempts to cross below axis: movement is clamped so theme remains above the timeline axis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support creating a theme by click-dragging from mouse-down (left edge) to mouse-up (right edge).
- **FR-002**: System MUST apply deterministic vertical anchoring for creation:
  downward drag uses initial point as top-left; upward drag uses initial point as bottom-left.
- **FR-003**: System MUST update the theme preview rectangle continuously while dragging so users can observe live size and position changes.
- **FR-004**: System MUST snap theme placement and resizing to a 4px vertical grid for all visible top and bottom edge outcomes.
- **FR-005**: If horizontal pixel snapping is already present, system MUST apply the same 4px snapping increment horizontally; if not present, system MUST preserve existing horizontal behavior.
- **FR-006**: System MUST allow themes to float at arbitrary vertical positions and MUST NOT force theme bottom or top edges to a fixed baseline.
- **FR-006a**: System MUST constrain theme placement and resize geometry to the above-axis region; themes MUST NOT cross below the timeline axis.
- **FR-007**: System MUST allow placing multiple themes in overlapping time ranges with independent vertical stacking.
- **FR-008**: System MUST provide independent top-edge and bottom-edge resize handles for each theme.
- **FR-008a**: System MUST provide bottom-left and bottom-right corner handles for themes in resize mode.
- **FR-008b**: Bottom-left corner drag MUST adjust the theme start edge and bottom edge together while keeping the top edge fixed.
- **FR-008c**: Bottom-right corner drag MUST adjust the theme end edge and bottom edge together while keeping the top edge fixed.
- **FR-009**: System MUST preserve timeline time-to-x mapping semantics; this feature may consume mapping outputs but MUST NOT change core timeline coordinate logic.
- **FR-010**: System MUST prevent save failures caused by decimal height/position values after resize operations.
- **FR-011**: System MUST disable or remove manual numeric height editing in theme UI for this feature release to avoid decimal-entry breakages.
- **FR-012**: System MUST keep this feature scoped to themes and MUST NOT introduce song block user-facing functionality.
- **FR-013**: In resize mode, system MUST allow vertical drag movement of an entire theme block while preserving above-axis constraint.
- **FR-013a**: Vertical drag movement of a theme block MUST be pure translation; it MUST NOT change theme duration or height.
- **FR-014**: Theme title rendering MUST use this priority as viewport/theme size changes: full title if it horizontally fits, otherwise abbreviated title if it horizontally fits, otherwise no in-block title and hover tooltip fallback.
- **FR-015**: Theme title visibility MUST NOT use a fixed horizontal minimum pixel threshold; visibility decisions MUST be based on measured horizontal text fit.
- **FR-016**: System MUST support an optional `abbreviatedTitle` field on themes for in-block fallback display.
- **FR-017**: If `abbreviatedTitle` is empty, system MUST NOT auto-generate one from `title` and MUST fall through to tooltip-only behavior when full title does not fit.
- **FR-018**: `abbreviatedTitle` MUST follow existing theme title validation constraints and MUST NOT introduce a stricter independent max-length limit.
- **FR-019**: Abbreviated-title display fallback MUST be determined by horizontal-fit checks only and MUST NOT be blocked solely by reduced theme height.
- **FR-020**: Full-title in-block display MUST allow rendering at theme heights down to 16px measured inclusive of border and padding.

### Assumptions

- Existing timeline pan/zoom behaviors remain unchanged by this feature.
- Existing conflict rules for overlapping themes (priority and tie behavior) remain as currently specified elsewhere.
- A minimum valid theme size exists and is enforced by current product constraints; this spec relies on that enforcement.

## Constitution Alignment *(mandatory)*

- **CA-001 Spec-First**: Planning artifacts required next are `plan.md` and `tasks.md` under `specs/005-theme-placement-v2/`; no unresolved clarifications block planning.
- **CA-002 Independent Slices**: User stories are independently implementable and testable: placement first (P1), resizing second (P2), reuse consistency guardrails third (P3).
- **CA-003 Verification Scope**: Verification must cover deterministic placement direction semantics, vertical snap correctness, floating stack behavior, and reliable save behavior after resize.
- **CA-004 Compatibility Impact**: Changes must stay aligned with existing timeline placement semantics and any theme edit flows already defined in prior specs under `specs/004-timeline-themes-sidebar/`.

### Key Entities *(include if feature involves data)*

- **Theme Block**: A time-bounded rectangular overlay with start time, end time, top edge position, bottom edge position, derived height, display metadata, and optional abbreviated title.
- **Placement Interaction**: A transient user action state containing pointer-down anchor, pointer-move preview, pointer-up commit, drag direction, and snapped output geometry.
- **Resize Interaction**: A transient user action state identifying target edge (top or bottom), pointer delta, snapped result, and persisted theme geometry update.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of theme create and resize operations land on 4px vertical increments.
- **SC-002**: In acceptance testing, users can place at least two themes in the same horizontal time slice at different vertical levels in 100% of tested runs.
- **SC-003**: In acceptance testing, drag-direction anchoring rules (top-left for downward drag, bottom-left for upward drag) are correct in at least 95% of scripted interaction trials.
- **SC-004**: Theme save success rate after resize is 100% in regression scenarios that previously failed due to decimal value handling.
