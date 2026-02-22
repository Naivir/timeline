import type { Page } from '@playwright/test'

export async function createMemoryFromHeader(page: Page): Promise<void> {
  await page.getByRole('button', { name: '+ Memory' }).click()
}

export async function createMemoryFromTimelineClick(page: Page, x: number, y: number): Promise<void> {
  const surface = page.getByTestId('timeline-surface')
  await surface.hover()
  await page.mouse.click(x, y)
}
