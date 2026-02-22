import { fireEvent } from '@testing-library/react'

export function wheelZoom(element: Element, deltaY: number, clientX = 400) {
  fireEvent.wheel(element, { deltaY, clientX })
}

export function dragHorizontally(element: Element, fromX: number, toX: number) {
  fireEvent.pointerDown(element, { button: 0, clientX: fromX, clientY: 100 })
  fireEvent.pointerMove(element, { clientX: toX, clientY: 100 })
  fireEvent.pointerUp(element, { clientX: toX, clientY: 100 })
}
