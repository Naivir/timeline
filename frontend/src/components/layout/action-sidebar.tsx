type ActionSidebarProps = {
  open: boolean
  mode: 'none' | 'memory' | 'theme'
  resizeMode: boolean
  onToggle: () => void
  onSelectMode: (mode: 'memory' | 'theme') => void
  onToggleResizeMode: () => void
}

export function ActionSidebar({
  open,
  mode,
  resizeMode,
  onToggle,
  onSelectMode,
  onToggleResizeMode,
}: ActionSidebarProps) {
  return (
    <div className="action-sidebar-shell">
      <button
        type="button"
        className="timeline-primary-button"
        aria-expanded={open}
        aria-controls="timeline-action-sidebar"
        onClick={onToggle}
      >
        Actions
      </button>
      {open ? (
        <aside id="timeline-action-sidebar" className="action-sidebar" data-testid="action-sidebar">
          <button
            type="button"
            className={`action-sidebar-button ${mode === 'memory' ? 'action-sidebar-button-active' : ''}`}
            onClick={() => onSelectMode('memory')}
          >
            New Memory
          </button>
          <button
            type="button"
            className={`action-sidebar-button ${mode === 'theme' ? 'action-sidebar-button-active' : ''}`}
            onClick={() => onSelectMode('theme')}
          >
            New Theme
          </button>
          <button type="button" className="action-sidebar-button" disabled>
            New Songs
          </button>
          <button
            type="button"
            className={`action-sidebar-button ${resizeMode ? 'action-sidebar-button-active' : ''}`}
            onClick={onToggleResizeMode}
          >
            Resize
          </button>
        </aside>
      ) : null}
    </div>
  )
}
