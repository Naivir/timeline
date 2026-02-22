# Data Model: Theme Placement v2

## Entity: ThemeBlock
- Description: Persisted timeline overlay range with floating vertical geometry and metadata.
- Fields:
  - `id` (string/UUID, required, unique)
  - `session_id` (string, required)
  - `start_time` (datetime, required)
  - `end_time` (datetime, required)
  - `title` (string, required, non-empty)
  - `description` (string, optional)
  - `tags` (string array, optional)
  - `color` (string, required)
  - `opacity` (number, required)
  - `priority` (integer, required, 0-1000)
  - `top_px` (number, required; snapped display value)
  - `bottom_px` (number, required; snapped display value)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - `end_time` MUST be greater than `start_time`.
  - `bottom_px` MUST be greater than `top_px` by at least minimum theme height.
  - Displayed `top_px` and `bottom_px` MUST align to 4px vertical grid.
  - `opacity` MUST be in configured safe range.
  - `priority` MUST be in `[0, 1000]`.

## Entity: ThemePlacementDraft
- Description: Transient state while creating a new theme rectangle.
- Fields:
  - `pointer_down_x` (number)
  - `pointer_down_y` (number)
  - `current_x` (number)
  - `current_y` (number)
  - `anchor_mode` (`top_left` | `bottom_left`, derived from drag direction)
  - `preview_start_time` (datetime)
  - `preview_end_time` (datetime)
  - `preview_top_px` (number)
  - `preview_bottom_px` (number)
- Validation rules:
  - `pointer_down_x` determines committed left edge.
  - `current_x` at release determines committed right edge.
  - `preview_top_px` and `preview_bottom_px` use 4px snapping.

## Entity: ThemeResizeSession
- Description: Transient interaction state for dragging theme edges.
- Fields:
  - `theme_id` (string)
  - `edge` (`top` | `bottom` | `start` | `end`)
  - `initial_geometry` (`start_time`, `end_time`, `top_px`, `bottom_px`)
  - `pointer_origin` (`x`, `y`)
  - `preview_geometry` (`start_time`, `end_time`, `top_px`, `bottom_px`)
- Validation rules:
  - Top and bottom edges are independently adjustable.
  - Vertical edge outputs are snapped to 4px increments.
  - Commit cannot invert rectangle (`bottom_px <= top_px`).

## Entity: PlacementEngineRules (Derived)
- Description: Reusable deterministic geometry rules shared by timeline range blocks.
- Rules:
  - Vertical snap increment is fixed at 4px.
  - Create anchor rule derives from drag direction.
  - Time mapping consumes existing timeline mapping only.
  - Engine outputs normalized rectangle geometry ready for persistence.

## Relationships
- `ThemePlacementDraft` produces one `ThemeBlock` on successful create.
- `ThemeResizeSession` updates one existing `ThemeBlock`.
- `PlacementEngineRules` is used by both draft and resize flows.

## State Transitions

### Create Flow
1. `Idle`
2. `PlacementArmed`
3. `DraggingPreview`
4. `DraftReady`
5. `Persisted`

Transition notes:
- `PlacementArmed -> DraggingPreview`: pointer-down begins draft.
- `DraggingPreview -> DraftReady`: pointer-up computes snapped geometry.
- `DraftReady -> Persisted`: user confirms save; geometry writes successfully.

### Resize Flow
1. `ThemeSelected`
2. `ResizeHandleActive`
3. `ResizePreview`
4. `ResizeCommitted`

Transition notes:
- `ThemeSelected -> ResizeHandleActive`: top or bottom handle pointer-down.
- `ResizeHandleActive -> ResizePreview`: pointer move updates snapped preview.
- `ResizePreview -> ResizeCommitted`: pointer-up commits valid geometry.
