import * as Dialog from '@radix-ui/react-dialog'

type ThemeConfirmModalProps = {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  pending?: boolean
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function ThemeConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  pending = false,
  onCancel,
  onConfirm,
}: ThemeConfirmModalProps) {
  return (
    <Dialog.Root open={open} modal onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="confirm-modal-overlay" />
        <Dialog.Content className="confirm-modal-content" data-testid="theme-confirm-modal">
          <Dialog.Title className="memory-confirm-title">{title}</Dialog.Title>
          <Dialog.Description className="memory-confirm-body">{body}</Dialog.Description>
          <div className="memory-form-actions">
            <button className="memory-secondary-button" type="button" disabled={pending} onClick={onCancel}>
              Keep editing
            </button>
            <button className="memory-primary-button" type="button" disabled={pending} onClick={() => void onConfirm()}>
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
