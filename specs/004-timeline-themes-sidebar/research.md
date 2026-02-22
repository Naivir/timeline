# Research: Timeline Themes, Sidebar, and Hover UX

## Decision 1: Fast hover preview uses delayed tooltip with bounded snippet
- Decision: Show memory hover tooltip after a short hover delay target of 120 ms (must stay <=150 ms), containing title plus first 2-4 words of description.
- Rationale: Balances responsiveness with accidental-hover suppression and matches explicit UX requirement for faster context preview.
- Alternatives considered:
  - Instant/no-delay tooltip: rejected due to higher visual noise during pointer travel.
  - Long delay (>250 ms): rejected because it feels laggy and conflicts with requirement.

## Decision 2: Use compact in-app confirm popup for delete/discard
- Decision: Keep edit/details panel separate from destructive confirmation, and use a small in-app modal/popup with explicit confirm/cancel buttons.
- Rationale: Maintains clear user intent, avoids browser-native dialogs, and matches established app visual system.
- Alternatives considered:
  - Browser `confirm()` dialogs: rejected as inconsistent and unstyled.
  - No confirmation for destructive actions: rejected for safety risk.

## Decision 3: Theme drag-create is above-axis only with minimum span
- Decision: New Theme mode allows pointer drag only in the above-axis region; selections below axis are ignored. Enforce minimum duration span so near-zero drags are not persisted.
- Rationale: Matches product model (themes above, songs below later) and prevents accidental micro-themes.
- Alternatives considered:
  - Allow create on both sides then normalize: rejected due to mode ambiguity.
  - Persist zero-width themes: rejected because it conflicts with range semantics.

## Decision 4: Overlap rendering order uses priority then creation recency
- Decision: Render theme stack order by `priority` ascending, then `created_at` ascending so the newest equal-priority theme visually overlays older ones.
- Rationale: Deterministic and directly aligned with requirement text.
- Alternatives considered:
  - Manual z-index editing by user: rejected as extra complexity for this scope.
  - Random/toggle-based overlap behavior: rejected due to non-determinism.

## Decision 5: Theme geometry model anchored to timeline axis
- Decision: Theme stores `[start_time, end_time]`, `height_px`, and is always bottom-anchored to axis (flush). Horizontal edge handles resize time span; vertical top-edge handle resizes height.
- Rationale: Satisfies “bottom flush” invariant and keeps resize math predictable.
- Alternatives considered:
  - Free vertical drag of entire theme: rejected because it violates flush requirement.
  - Percentage-based height only: rejected due to reduced direct manipulation precision.

## Decision 6: Sidebar interaction and New Songs placeholder behavior
- Decision: Add top-right toggleable action sidebar containing active `New Memory`, active `New Theme`, and disabled `New Songs (coming soon)` control.
- Rationale: Provides immediate scalability while preserving clear current scope.
- Alternatives considered:
  - Keep only top header buttons: rejected due to growing action clutter.
  - Hide New Songs entirely: rejected because requirement asks for visible placeholder.

## Decision 7: Data model split between Memory and Theme entities
- Decision: Persist Theme as distinct backend entity/table with separate API routes; no polymorphic merge into Memory table.
- Rationale: Theme behaviors (priority, color, opacity, height, overlap semantics) are distinct and would over-complicate memory schema.
- Alternatives considered:
  - Single shared timeline item table with type discriminator: rejected for this phase to reduce migration and validation complexity.

## Decision 8: Verification strategy includes mandatory screenshot sanity loop
- Decision: For each changed screen/popup, require automated screenshot capture and manual review; convert discovered visual defects into failing tests before final fix.
- Rationale: Aligns with constitution and prevents UI regressions not covered by pure DOM assertions.
- Alternatives considered:
  - Assertion-only e2e without screenshots: rejected because visual defects can pass functional checks.
