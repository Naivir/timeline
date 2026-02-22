import { expect, test } from '@playwright/test'

test('remains stable under rapid pan and zoom alternation', async ({ page }) => {
  await page.goto('/')
  const surface = page.getByTestId('timeline-surface')

  await surface.hover()

  for (let i = 0; i < 8; i += 1) {
    await page.mouse.down()
    await page.mouse.move(650, 120)
    await page.mouse.move(250, 120)
    await page.mouse.up()
    await page.mouse.wheel(0, i % 2 === 0 ? -300 : 300)
  }

  await expect(surface).toHaveAttribute('data-resolution', /year|month|day|hour/)

  const start = await surface.getAttribute('data-start-ms')
  const end = await surface.getAttribute('data-end-ms')

  expect(start).toBeTruthy()
  expect(end).toBeTruthy()
  expect(Number(start)).toBeGreaterThan(0)
  expect(Number(end)).toBeGreaterThan(Number(start))

  await expect(page.getByTestId('timeline-label').first()).toBeVisible()
})
