import { expect, test } from '@playwright/test'

test('updates labels while panning and zooming', async ({ page }) => {
  await page.goto('/')

  const labelsBefore = await page.getByTestId('timeline-label').allTextContents()
  const surface = page.getByTestId('timeline-surface')

  await surface.hover()
  await page.mouse.down()
  await page.mouse.move(500, 120)
  await page.mouse.move(300, 120)
  await page.mouse.up()
  await page.mouse.wheel(0, -500)

  const labelsAfter = await page.getByTestId('timeline-label').allTextContents()
  expect(labelsAfter.length).toBeGreaterThan(0)
  expect(labelsAfter.join('|')).not.toBe(labelsBefore.join('|'))

  const labels = page.getByTestId('timeline-label')
  const count = await labels.count()
  expect(count).toBeGreaterThan(0)
  await expect(page.locator('.timeline-fade-left')).toBeVisible()
  await expect(page.locator('.timeline-fade-right')).toBeVisible()

  const fadeWidth = await page.locator('.timeline-fade-left').evaluate((el) => Number.parseFloat(window.getComputedStyle(el).width))
  expect(fadeWidth).toBeGreaterThanOrEqual(160)

  let hasVisibleLabel = false
  for (let i = 0; i < count; i += 1) {
    const opacity = await labels.nth(i).evaluate((el) => Number(window.getComputedStyle(el).opacity))
    expect(opacity).toBeGreaterThanOrEqual(0)
    if (opacity > 0) hasVisibleLabel = true
  }
  expect(hasVisibleLabel).toBeTruthy()
})
