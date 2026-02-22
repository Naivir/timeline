export type ViewState = 'loading' | 'ready' | 'error'

export function isLoading(state: ViewState): boolean {
  return state === 'loading'
}

export function isReady(state: ViewState): boolean {
  return state === 'ready'
}

export function isError(state: ViewState): boolean {
  return state === 'error'
}
