# Contract: Timeline Interaction and Navigation

## Purpose
Define the externally observable interaction contract for timeline panning,
zooming, resolution transitions, and label rendering behavior.

## Interaction Inputs

### Pan Input
- Trigger: Primary-button drag on timeline surface.
- Contract:
  - Horizontal drag delta MUST translate visible time range proportionally.
  - No snapping behavior occurs by default.
  - Zoom level/resolution MUST remain unchanged during pure pan.

### Zoom Input
- Trigger: Wheel/trackpad zoom gesture over timeline surface.
- Contract:
  - Zoom changes temporal resolution and scale, not only pixel magnification.
  - Zoom MUST preserve focal anchor (`cursor` preferred, fallback `center`).
  - Resolution transitions MUST follow ordered bands:
    `year -> month -> day -> hour` and reverse deterministically.

## Derived State Outputs
At any interaction frame, system MUST expose:
- `visibleTimeRange` (`startTime`, `endTime`)
- `activeResolution` (`year|month|day|hour`)
- `timeToX` mapping function (deterministic and invertible in visible range)

## Label Contract
- Labels MUST reflect active resolution formatting.
- Label placement MUST enforce readability spacing rules.
- Labels MUST update during pan and zoom without blocking interaction continuity.

## Visual Continuation Contract
- Left/right fade cues MUST remain visible to indicate continuation beyond viewport.
- Timeline vertical placement MUST remain stable during all interactions.

## Out-of-Scope Guardrails
- No memory/event attachment rendering.
- No attachment editing workflows.
- No backend persistence or API behavior assumptions.
