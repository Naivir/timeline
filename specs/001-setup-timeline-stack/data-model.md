# Data Model: Timeline Foundation

## Entity: Timeline
- Purpose: Root aggregate rendered in the timeline view.
- Fields:
  - `id` (string, required, immutable)
  - `title` (string, required, 1-120 chars)
  - `startLabel` (string, required)
  - `endLabel` (string, required)
  - `createdAt` (ISO-8601 datetime string, required)
  - `updatedAt` (ISO-8601 datetime string, required)
- Validation Rules:
  - `id` must be unique within the service response scope.
  - `startLabel` and `endLabel` cannot be empty.

## Entity: TimelineBaseline
- Purpose: Defines the straight line anchor used for rendering.
- Fields:
  - `orientation` (enum: `horizontal`, required)
  - `positionPercent` (number, required, range 0-100)
  - `thicknessPx` (number, required, range 1-12)
  - `lengthPercent` (number, required, range 10-100)
- Validation Rules:
  - Current MVP only accepts `horizontal` orientation.
  - Invalid values must fail validation before response serialization.

## Entity: TimelineEventPlaceholder
- Purpose: Future-compatible attachment points for memories/icons.
- Fields:
  - `id` (string, required)
  - `timeLabel` (string, required)
  - `positionPercent` (number, required, range 0-100)
  - `status` (enum: `empty`, `reserved`; default `empty`)
  - `metadata` (object, optional)
- Validation Rules:
  - `id` must be unique per timeline.
  - `positionPercent` values outside range are rejected.

## Entity: ServiceStatus
- Purpose: Communicate service availability and diagnostics for client behavior.
- Fields:
  - `status` (enum: `ok`, `degraded`, required)
  - `message` (string, required)
  - `checkedAt` (ISO-8601 datetime string, required)
- Validation Rules:
  - `status=ok` should provide a non-empty operational message.

## Relationships
- One `Timeline` has one `TimelineBaseline`.
- One `Timeline` has many `TimelineEventPlaceholder` records.
- `ServiceStatus` is independent and exposed via health endpoint.

## State Transitions
- Timeline page UI state:
  - `loading` -> `ready` when timeline payload passes validation.
  - `loading` -> `error` when fetch fails or payload validation fails.
  - `error` -> `loading` when user triggers retry.
  - `ready` remains stable for this phase (no editing actions).
