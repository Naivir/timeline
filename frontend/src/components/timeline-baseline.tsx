import type { TimelineViewModel } from '../services/timeline-mapper'

type TimelineBaselineProps = {
  timeline: TimelineViewModel
}

export function TimelineBaseline({ timeline }: TimelineBaselineProps) {
  return (
    <section
      aria-label="Timeline baseline"
      role="region"
      className="relative rounded-xl border border-slate-200 bg-card p-8"
    >
      <div className="mb-4 flex justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
        <span>{timeline.startLabel}</span>
        <span>{timeline.endLabel}</span>
      </div>

      <div className="relative h-16">
        <div
          aria-label="Base timeline line"
          className="timeline-line absolute left-1/2 top-1/2 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ width: `${timeline.lineLengthPercent}%` }}
        />

        {timeline.markers.map((item) => (
          <div
            key={item.id}
            aria-label={`Timeline marker ${item.label}`}
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-accent bg-white"
            style={{ left: `${item.positionPercent}%` }}
            title={item.label}
          />
        ))}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Request: <span className="font-mono">{timeline.requestId}</span>
      </div>
    </section>
  )
}
