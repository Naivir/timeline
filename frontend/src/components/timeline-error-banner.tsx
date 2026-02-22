import { Button } from './ui/button'

type TimelineErrorBannerProps = {
  message: string
  onRetry: () => void
}

export function TimelineErrorBanner({ message, onRetry }: TimelineErrorBannerProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
      <p className="mb-3 text-sm text-red-800">{message}</p>
      <Button className="bg-red-700" onClick={onRetry}>
        Retry Timeline Load
      </Button>
    </div>
  )
}
