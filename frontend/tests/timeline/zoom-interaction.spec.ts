import { expect, test } from '@playwright/test'

test('zooms in and blocks further zoom at minimum bound', async ({ page }) => {
  await page.goto('/')
  const surface = page.getByTestId('timeline-surface')

  const beforeStart = Number(await surface.getAttribute('data-start-ms'))
  const beforeEnd = Number(await surface.getAttribute('data-end-ms'))
  const beforeDuration = beforeEnd - beforeStart

  await surface.hover()
  await page.mouse.wheel(0, -500)
  await expect
    .poll(async () => {
      const start = Number(await surface.getAttribute('data-start-ms'))
      const end = Number(await surface.getAttribute('data-end-ms'))
      return end - start
    })
    .toBeLessThan(beforeDuration)

  let zoomedStart = Number(await surface.getAttribute('data-start-ms'))
  let zoomedEnd = Number(await surface.getAttribute('data-end-ms'))
  let zoomedDuration = zoomedEnd - zoomedStart

  for (let i = 0; i < 200; i += 1) {
    await page.mouse.wheel(0, -500)
  }
  let previousDuration = Number(await surface.getAttribute('data-end-ms')) - Number(await surface.getAttribute('data-start-ms'))
  let blockedDuration = previousDuration
  for (let i = 0; i < 50; i += 1) {
    await page.mouse.wheel(0, -500)
    const currentDuration = Number(await surface.getAttribute('data-end-ms')) - Number(await surface.getAttribute('data-start-ms'))
    if (currentDuration === previousDuration) {
      blockedDuration = currentDuration
      break
    }
    previousDuration = currentDuration
  }

  await page.mouse.wheel(0, -500)
  const postBlockedDuration = Number(await surface.getAttribute('data-end-ms')) - Number(await surface.getAttribute('data-start-ms'))
  expect(postBlockedDuration).toBe(blockedDuration)
})
