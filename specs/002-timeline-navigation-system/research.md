# Research: Timeline Navigation System

## Decision 1: Zoom gesture policy
- Decision: Use mouse wheel/trackpad scroll for zoom on desktop, centered on
  cursor position when available.
- Rationale: Aligns with common timeline/map interaction patterns and supports
  focal-point preservation requirements.
- Alternatives considered:
  - Button-only zoom controls: rejected because interaction would be slower.
  - Pinch-only zoom: rejected due to inconsistent desktop support.

## Decision 2: Fade-edge behavior baseline
- Decision: Apply fixed left/right gradient fade overlays at timeline boundaries
  that remain visible during pan and zoom.
- Rationale: Conveys continuation beyond viewport without changing layout flow.
- Alternatives considered:
  - No fade cue: rejected because continuation is less discoverable.
  - Dynamic fade size tied to zoom: rejected for unnecessary visual complexity.

## Decision 3: Resolution transition model
- Decision: Use deterministic zoom bands mapped to `year`, `month`, `day`,
  `hour` in ordered thresholds; transitions are strictly reversible when crossing
  thresholds in opposite direction.
- Rationale: Guarantees predictable behavior and supports testable roundtrip logic.
- Alternatives considered:
  - Continuous arbitrary scales without discrete levels: rejected because active
    label format would be ambiguous.

## Decision 4: Label density/readability strategy
- Decision: Use adaptive tick spacing with minimum pixel gap and deterministic
  label skipping (every Nth tick) when density exceeds readability threshold.
- Rationale: Maintains readability during rapid pan/zoom while preserving context.
- Alternatives considered:
  - Render all ticks always: rejected due to overlap and unreadable labels.
  - Manual label toggles: rejected as unnecessary interaction burden.

## Decision 5: Browser verification scope
- Decision: Add Playwright browser tests validating pan continuity, zoom
  resolution transitions, and live label updates.
- Rationale: User-visible interaction quality requires real browser event testing,
  not only mocked unit assertions.
- Alternatives considered:
  - Unit tests only: rejected because pointer/scroll behavior can diverge in browser.
