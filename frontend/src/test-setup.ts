import '@testing-library/jest-dom'

class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (!('ResizeObserver' in globalThis)) {
  ;(globalThis as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver =
    ResizeObserverMock
}
