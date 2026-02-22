import { expect, test } from '@playwright/test'

test('pans timeline by drag interaction', async ({ page }) => {
  await page.goto('/')

  const surface = page.getByTestId('timeline-surface')
  const startBefore = await surface.getAttribute('data-start-ms')

  await surface.hover()
  await page.mouse.down()
  await page.mouse.move(250, 120)
  await page.mouse.move(550, 120)
  await page.mouse.up()

  const startAfter = await surface.getAttribute('data-start-ms')
  expect(startAfter).not.toBe(startBefore)
})
