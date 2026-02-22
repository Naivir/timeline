import type { Page } from '@playwright/test'

export async function createMemoryFromHeader(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'New Memory' }).click()
}

export async function createMemoryFromTimelineClick(page: Page, x: number, y: number): Promise<void> {
  const surface = page.getByTestId('timeline-surface')
  await surface.hover()
  await page.mouse.click(x, y)
}

export async function openThemeMode(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'New Theme' }).click()
}
