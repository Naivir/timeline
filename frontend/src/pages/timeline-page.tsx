import { TimelineSurface } from '../components/timeline/timeline-surface'

export default function TimelinePage() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      <header className="pointer-events-none absolute left-1/2 top-8 z-10 w-full -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Timeline</p>
        <h1 className="mt-2 text-3xl font-semibold">Timeline Navigator</h1>
        <p className="mt-2 text-xs text-slate-500">Drag horizontally. Zoom to change scale.</p>
      </header>

      <div className="flex min-h-screen w-full items-center justify-center">
        <TimelineSurface />
      </div>
    </main>
  )
}
