import * as Dialog from '@radix-ui/react-dialog'
import { Edit3, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { MemoryUpdateRequest, MemoryItem } from '../../services/memories/memory-types'

type MemoryDetailsPanelProps = {
  memory: MemoryItem | null
  onClose: () => void
  onSave: (memoryId: string, payload: MemoryUpdateRequest) => Promise<void>
  onDelete?: (memoryId: string) => Promise<void>
  onDiscardNew?: (memoryId: string) => Promise<void>
  startInEditMode?: boolean
  isNewlyCreated?: boolean
}

export function MemoryDetailsPanel({
  memory,
  onClose,
  onSave,
  onDelete,
  onDiscardNew,
  startInEditMode = false,
  isNewlyCreated = false,
}: MemoryDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(startInEditMode)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'delete' | 'discard-new' | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (!memory) return
    setTitle(memory.title)
    setDescription(memory.description ?? '')
    setTagsText((memory.tags ?? []).join(', '))
    setIsEditing(startInEditMode)
  }, [memory, startInEditMode])

  if (!memory) return null

  const formatTimestamp = () => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    if (memory.anchor.type === 'point') {
      return formatter.format(new Date(memory.anchor.timestamp))
    }
    return `${formatter.format(new Date(memory.anchor.start))} - ${formatter.format(new Date(memory.anchor.end))}`
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    setIsSaving(true)
    try {
      await onSave(memory.id, {
        title: trimmedTitle,
        description: description.trim() || undefined,
        tags,
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root open modal={false} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Content className="memory-details" data-testid="memory-details-panel" aria-label="Memory details">
          <div className="memory-details-header">
            <Dialog.Title className="memory-details-title">
              {isEditing ? 'Edit Memory' : 'Memory Details'}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Memory details and editor panel.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="memory-secondary-button" type="button" onClick={onClose} aria-label="Close">
                <X size={14} />
              </button>
            </Dialog.Close>
          </div>

          {isEditing ? (
            <form className="memory-form" onSubmit={onSubmit}>
              <label className="memory-field">
                <span>Title</span>
                <input
                  aria-label="Title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  autoFocus
                  required
                  minLength={1}
                  maxLength={120}
                />
              </label>
              <label className="memory-field">
                <span>Description</span>
                <textarea
                  aria-label="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                />
              </label>
              <label className="memory-field">
                <span>Tags</span>
                <input
                  aria-label="Tags"
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                  placeholder="note, work, travel"
                />
              </label>
              <div className="memory-form-actions">
                <button
                  className="memory-secondary-button"
                  type="button"
                  onClick={() => {
                    if (isNewlyCreated && onDiscardNew) {
                      setConfirmAction('discard-new')
                      return
                    }
                    setTitle(memory.title)
                    setDescription(memory.description ?? '')
                    setTagsText((memory.tags ?? []).join(', '))
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </button>
                <button className="memory-primary-button" type="submit" disabled={isSaving || !title.trim()}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl>
                <div>
                  <dt>Title</dt>
                  <dd>{memory.title}</dd>
                </div>
                <div>
                  <dt>Description</dt>
                  <dd>{memory.description ?? 'No description'}</dd>
                </div>
              </dl>
              <div className="memory-meta-footer">
                <div className="memory-meta-item">
                  <span>Tags</span>
                  <p>{memory.tags.length > 0 ? memory.tags.join(', ') : 'No tags'}</p>
                </div>
                <div className="memory-meta-item">
                  <span>Timestamp</span>
                  <p>{formatTimestamp()}</p>
                </div>
              </div>
              <div className="memory-form-actions">
                <button
                  className="memory-secondary-button"
                  type="button"
                  onClick={() => {
                    if (!onDelete) return
                    setConfirmAction('delete')
                  }}
                >
                  Delete
                </button>
                <button className="memory-primary-button" type="button" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>
            </>
          )}
          {confirmAction ? (
            <div className="memory-confirm-overlay" data-testid="memory-confirm-overlay">
              <div className="memory-confirm-dialog" data-testid="memory-confirm-dialog">
                <h3 className="memory-confirm-title">
                  {confirmAction === 'delete' ? 'Delete memory?' : 'Cancel new memory?'}
                </h3>
                <p className="memory-confirm-body">
                  {confirmAction === 'delete'
                    ? 'This will remove the selected memory. You can undo after deleting.'
                    : 'Are you sure you want to cancel? This new memory will be discarded.'}
                </p>
                <div className="memory-form-actions">
                  <button
                    className="memory-secondary-button"
                    type="button"
                    disabled={isConfirming}
                    onClick={() => setConfirmAction(null)}
                  >
                    Keep editing
                  </button>
                  <button
                    className="memory-primary-button"
                    type="button"
                    disabled={isConfirming}
                    onClick={async () => {
                      setIsConfirming(true)
                      try {
                        if (confirmAction === 'delete' && onDelete) {
                          await onDelete(memory.id)
                          onClose()
                        }
                        if (confirmAction === 'discard-new' && onDiscardNew) {
                          await onDiscardNew(memory.id)
                          onClose()
                        }
                        setConfirmAction(null)
                      } finally {
                        setIsConfirming(false)
                      }
                    }}
                  >
                    {confirmAction === 'delete' ? 'Delete memory' : 'Discard memory'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
