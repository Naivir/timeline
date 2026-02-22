# Data Model: Timeline Themes, Sidebar, and Hover UX

## Entity: Theme
- Description: A timeline-attached visual range rendered above the axis and used to group/label periods.
- Fields:
  - `id` (string/UUID, required, unique)
  - `session_id` (string, required)
  - `start_time` (datetime, required)
  - `end_time` (datetime, required)
  - `title` (string, required, non-empty)
  - `description` (string, optional)
  - `tags` (string array, optional, default empty)
  - `color` (string, required; normalized color token/hex)
  - `opacity` (number, required; range 0.05-1.0)
  - `priority` (integer, required; range 0-1000)
  - `height_px` (number, required; min/max bounded)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - `end_time` MUST be strictly greater than `start_time`.
  - `priority` MUST be integer in [0, 1000].
  - `opacity` MUST be within configured bounds.
  - `height_px` MUST be within configured bounds.

## Entity: ThemeLayerOrder (Derived)
- Description: Deterministic rendering order for overlapping themes.
- Inputs:
  - `priority`
  - `created_at`
  - `id` (stable tie-break fallback)
- Ordering rule:
  - Lower values render below higher values.
  - Sort key: `(priority ASC, created_at ASC, id ASC)`.
  - Therefore the latest equal-priority theme appears on top.

## Entity: MemoryHoverPreview (View State)
- Description: Transient hover tooltip state for memories.
- Fields:
  - `memory_id`
  - `title`
  - `snippet` (first 2-4 words of description, optional)
  - `visible`
  - `shown_at`
- Validation rules:
  - Tooltip becomes visible within <=150 ms after hover entry.
  - Tooltip hides on hover leave or focus loss.

## Entity: ConfirmationPopupState (UI State)
- Description: Compact in-app confirmation dialog state for destructive actions.
- Fields:
  - `kind` (`delete_memory` | `discard_new_memory`)
  - `target_id`
  - `is_open`
  - `is_processing`
- Validation rules:
  - Requires explicit user action to confirm or cancel.
  - Confirm action must execute exactly once.

## Entity: ActionSidebarState (UI State)
- Description: Top-right toggleable action menu state.
- Fields:
  - `is_open`
  - `available_actions` (`new_memory`, `new_theme`, `new_songs_placeholder`)
  - `active_mode` (`none` | `memory_placement` | `theme_placement`)
- Validation rules:
  - `new_songs_placeholder` is visible but disabled for this feature.
  - Switching modes clears conflicting placement mode.

## State Transitions

### Theme Lifecycle
1. `Idle`
2. `PlacementArmed`
3. `DraggingRangePreview`
4. `DraftThemeEditing`
5. `PersistedTheme`
6. `SelectedTheme`
7. `ResizingSpanOrHeight`
8. `DeletedTheme`

### Theme Transition Rules
- `Idle -> PlacementArmed`: user activates New Theme.
- `PlacementArmed -> DraggingRangePreview`: pointer-down + drag above axis.
- `DraggingRangePreview -> DraftThemeEditing`: valid drag-release creates draft and opens popup.
- `DraftThemeEditing -> PersistedTheme`: save with valid fields.
- `DraftThemeEditing -> Idle`: cancel/discard confirmed.
- `PersistedTheme <-> SelectedTheme`: select/deselect via click.
- `SelectedTheme -> ResizingSpanOrHeight`: drag horizontal/vertical handles.
- `ResizingSpanOrHeight -> PersistedTheme`: release and persist updated geometry.
- `PersistedTheme -> DeletedTheme`: delete confirmed.

### Overlay Ordering Invariants
- Theme layers render below timeline ticks and labels.
- Memory markers and connector lines render above theme layers.
- Theme title is centered if it fits; otherwise hidden inline and shown via hover.
