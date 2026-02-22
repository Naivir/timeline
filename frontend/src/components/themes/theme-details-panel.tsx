import { Edit3, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ThemeItem, ThemeUpdateRequest } from '../../services/themes/theme-types'
import { ThemeConfirmModal } from './theme-confirm-modal'

type ThemeDetailsPanelProps = {
  theme: ThemeItem | null
  startInEditMode?: boolean
  isNewlyCreated?: boolean
  onClose: () => void
  onSave: (themeId: string, payload: ThemeUpdateRequest) => Promise<void>
  onDelete: (themeId: string) => Promise<void>
  onDiscardNew: (themeId: string) => Promise<void>
}

export function ThemeDetailsPanel({
  theme,
  startInEditMode = false,
  isNewlyCreated = false,
  onClose,
  onSave,
  onDelete,
  onDiscardNew,
}: ThemeDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(startInEditMode)
  const [title, setTitle] = useState('')
  const [abbreviatedTitle, setAbbreviatedTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [opacity, setOpacity] = useState('0.3')
  const [priority, setPriority] = useState('100')
  const [confirmAction, setConfirmAction] = useState<'delete' | 'discard-new' | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!theme) return
    setTitle(theme.title)
    setAbbreviatedTitle(theme.abbreviatedTitle ?? '')
    setDescription(theme.description ?? '')
    setTagsText((theme.tags ?? []).join(', '))
    setColor(theme.color)
    setOpacity(String(theme.opacity))
    setPriority(String(theme.priority))
    setIsEditing(startInEditMode)
  }, [theme, startInEditMode])

  if (!theme) return null

  const fmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  const timestampText = `${fmt.format(new Date(theme.startTime))} - ${fmt.format(new Date(theme.endTime))}`

  const submit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!title.trim()) return

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    setIsPending(true)
    try {
      await onSave(theme.id, {
        title: title.trim(),
        abbreviatedTitle: abbreviatedTitle.trim() || undefined,
        description: description.trim() || undefined,
        tags,
        color,
        opacity: Number(opacity),
        priority: Number(priority),
      })
      setIsEditing(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <section className="theme-details" data-testid="theme-details-panel" aria-label="Theme details">
          <div className="memory-details-header">
            <h2 className="memory-details-title">{isEditing ? 'Edit Theme' : 'Theme Details'}</h2>
            <button className="memory-secondary-button" type="button" onClick={onClose} aria-label="Close">
              <X size={14} />
            </button>
          </div>

          {isEditing ? (
            <form className="memory-form" onSubmit={submit}>
              <label className="memory-field">
                <span>Title</span>
                <input aria-label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
              </label>
              <label className="memory-field">
                <span>Abbreviated Title</span>
                <input
                  aria-label="Abbreviated Title"
                  value={abbreviatedTitle}
                  onChange={(event) => setAbbreviatedTitle(event.target.value)}
                />
              </label>
              <label className="memory-field">
                <span>Description</span>
                <textarea aria-label="Description" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
              <div className="theme-edit-grid">
                <label className="memory-field">
                  <span>Tags</span>
                  <input aria-label="Tags" value={tagsText} onChange={(event) => setTagsText(event.target.value)} />
                </label>
                <label className="memory-field">
                  <span>Color</span>
                  <input aria-label="Color" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
                </label>
                <label className="memory-field">
                  <span>Opacity</span>
                  <input aria-label="Opacity" type="number" min={0.05} max={1} step={0.05} value={opacity} onChange={(event) => setOpacity(event.target.value)} />
                </label>
                <label className="memory-field">
                  <span>Priority</span>
                  <input aria-label="Priority" type="number" min={0} max={1000} step={1} value={priority} onChange={(event) => setPriority(event.target.value)} />
                </label>
              </div>
              <div className="memory-form-actions">
                <button
                  className="memory-secondary-button"
                  type="button"
                  onClick={() => {
                    if (isNewlyCreated) {
                      setConfirmAction('discard-new')
                      return
                    }
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </button>
                <button className="memory-primary-button" type="submit" disabled={isPending || !title.trim()}>
                  {isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl>
                <div>
                  <dt>Title</dt>
                  <dd>{theme.title}</dd>
                </div>
                <div>
                  <dt>Abbreviated Title</dt>
                  <dd>{theme.abbreviatedTitle ?? 'None'}</dd>
                </div>
                <div>
                  <dt>Description</dt>
                  <dd>{theme.description ?? 'No description'}</dd>
                </div>
              </dl>
              <div className="memory-meta-footer">
                <div className="memory-meta-item">
                  <span>Tags</span>
                  <p>{theme.tags.length > 0 ? theme.tags.join(', ') : 'No tags'}</p>
                </div>
                <div className="memory-meta-item">
                  <span>Timestamp</span>
                  <p>{timestampText}</p>
                </div>
              </div>
              <div className="memory-form-actions">
                <button className="memory-secondary-button" type="button" onClick={() => setConfirmAction('delete')}>
                  Delete
                </button>
                <button className="memory-primary-button" type="button" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>
            </>
          )}

      </section>
      <ThemeConfirmModal
        open={confirmAction != null}
        pending={isPending}
        title={confirmAction === 'delete' ? 'Delete theme?' : 'Cancel new theme?'}
        body={
          confirmAction === 'delete'
            ? 'This will permanently remove the selected theme.'
            : 'Are you sure you want to cancel? This new theme will be discarded.'
        }
        confirmLabel={confirmAction === 'delete' ? 'Delete theme' : 'Discard theme'}
        onCancel={() => setConfirmAction(null)}
        onConfirm={async () => {
          setIsPending(true)
          try {
            if (confirmAction === 'delete') {
              await onDelete(theme.id)
              onClose()
            } else {
              await onDiscardNew(theme.id)
              onClose()
            }
          } finally {
            setIsPending(false)
            setConfirmAction(null)
          }
        }}
      />
    </>
  )
}
