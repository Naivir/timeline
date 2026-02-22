# Data Model: Timeline Navigation System

## Entity: TimelineViewport
- Purpose: Represents the currently visible temporal window and geometry.
- Fields:
  - `startTime` (datetime/epoch, required)
  - `endTime` (datetime/epoch, required)
  - `widthPx` (number, required, >0)
  - `centerTime` (datetime/epoch, derived)
- Validation Rules:
  - `startTime < endTime` MUST always hold.
  - `widthPx` MUST remain stable during interaction frame updates.

## Entity: ResolutionLevel
- Purpose: Active timeline granularity.
- Fields:
  - `level` (enum: `year`, `month`, `day`, `hour`)
  - `zoomBandMin` (number, required)
  - `zoomBandMax` (number, required)
- Validation Rules:
  - Zoom bands MUST be non-overlapping and ordered.
  - Reverse zoom across same threshold MUST restore prior level deterministically.

## Entity: TimeScaleMapping
- Purpose: Deterministic mapping between time values and horizontal positions.
- Fields:
  - `pixelsPerUnit` (number, required)
  - `unitType` (enum aligned with active resolution)
  - `originTime` (datetime/epoch, required)
  - `originX` (number, required)
- Validation Rules:
  - Mapping MUST be invertible for visible range.
  - For a fixed state, repeated conversion results MUST be identical.

## Entity: LabelTick
- Purpose: Renderable time label candidate.
- Fields:
  - `timestamp` (datetime/epoch, required)
  - `x` (number, required)
  - `text` (string, required)
  - `visible` (boolean, required)
- Validation Rules:
  - Visible labels MUST respect minimum spacing threshold.
  - Label format MUST match active resolution level.

## Entity: InteractionAnchor
- Purpose: Focal reference for zoom preservation.
- Fields:
  - `anchorX` (number, required)
  - `anchorTime` (datetime/epoch, required)
  - `anchorMode` (enum: `cursor`, `center`)
- Validation Rules:
  - Zoom updates MUST preserve anchor mapping within tolerance bounds.

## Relationships
- `TimelineViewport` uses one active `ResolutionLevel`.
- `TimeScaleMapping` is derived from `TimelineViewport` + `ResolutionLevel`.
- `LabelTick` values are generated from `TimeScaleMapping` and filtered by
  spacing/readability rules.
- `InteractionAnchor` influences zoom updates to `TimelineViewport` and
  `TimeScaleMapping`.

## State Transitions
- Pan transition:
  - Input drag delta updates `startTime`/`endTime` proportionally.
  - `ResolutionLevel` remains unchanged.
- Zoom transition:
  - Zoom input updates scale and recalculates viewport around `InteractionAnchor`.
  - `ResolutionLevel` changes only when threshold band boundaries are crossed.
- Label update transition:
  - Recompute ticks after each pan/zoom frame and apply visibility filtering.
