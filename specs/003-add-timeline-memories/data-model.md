# Data Model: Timeline Memory Interactions

## Entity: Memory
- Description: Canonical persisted memory item attached to timeline time coordinates.
- Fields:
  - `id` (string/UUID, required, unique)
  - `timeline_id` (string, required)
  - `anchor_type` (`point` | `range`, required)
  - `timestamp` (datetime, required when `anchor_type=point`)
  - `range_start` (datetime, required when `anchor_type=range`)
  - `range_end` (datetime, required when `anchor_type=range`)
  - `title` (string, required, non-empty, trimmed)
  - `description` (string, optional)
  - `tags` (string array, optional, default empty)
  - `deleted_at` (datetime, nullable; populated during undo window)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Exactly one anchor form is valid at a time.
  - `range_end` MUST be `>= range_start` for range anchors.
  - Title length > 0 after trimming.

## Entity: MemoryDeletionRecord
- Description: Reversible delete event used for undo window.
- Fields:
  - `deletion_id` (string/UUID, required, unique)
  - `memory_id` (string/UUID, required)
  - `snapshot` (object/json, required; full deleted memory payload)
  - `expires_at` (datetime, required)
  - `created_at` (datetime, required)
- Validation rules:
  - Undo allowed only while `now <= expires_at`.

## Entity: TimelineSession
- Description: Session-scoped timeline container for memory persistence.
- Fields:
  - `id` (string/UUID, required, unique)
  - `name` (string, optional)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Relationships:
  - One `TimelineSession` has many `Memory` records.

## Derived View Model: MemoryPresentation
- Description: Non-persistent rendering projection based on timeline state.
- Fields:
  - `memory_id`
  - `x_start`
  - `x_end` (optional for point)
  - `display_mode` (`full` | `compact` | `aggregated-indicator`)
  - `is_selected`
- Constraints:
  - Derived only from canonical memory data + timeline mapping + zoom level.
  - Never written back as canonical memory data.

## State Transitions

### Memory Lifecycle
1. `Draft` (frontend only during create flow)
2. `Persisted` (saved in backend DB)
3. `Selected` (UI state over persisted memory)
4. `SoftDeletedPendingUndo` (deleted with undo window active)
5. `Restored` (undo action reverts to persisted)
6. `DeletedFinal` (undo window expired or finalized delete)

### Transition Rules
- Create commit: `Draft -> Persisted`.
- Select/deselect toggles `Selected` UI state; does not mutate persistence fields.
- Delete action: `Persisted -> SoftDeletedPendingUndo` + create deletion record.
- Undo within window: `SoftDeletedPendingUndo -> Restored`.
- Undo timeout: `SoftDeletedPendingUndo -> DeletedFinal`.
