import { expect, test } from '@playwright/test'

test('timeline pan/zoom remains usable with memory overlays present', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: [
            {
              id: 'memory-pan-1',
              sessionId: 'timeline-main',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: 'Pan target',
              description: null,
              tags: ['note'],
              verticalRatio: 0.35,
              createdAt: '2026-02-20T10:15:00Z',
              updatedAt: '2026-02-20T10:15:00Z',
            },
          ],
        }),
      })
      return
    }
    await route.continue()
  })

  await page.goto('/')

  const surface = page.getByTestId('timeline-surface')
  const beforeStart = Number(await surface.getAttribute('data-start-ms'))

  await surface.dispatchEvent('wheel', { deltaY: -120, clientX: 500, clientY: 200 })
  const afterZoomStart = Number(await surface.getAttribute('data-start-ms'))
  expect(afterZoomStart).not.toBe(beforeStart)

  const box = await surface.boundingBox()
  if (!box) throw new Error('timeline surface missing bounding box')
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5)
  await page.mouse.up()

  const afterPanStart = Number(await surface.getAttribute('data-start-ms'))
  expect(afterPanStart).not.toBe(afterZoomStart)

  await page.getByLabel('Memory: Pan target').click()
  await expect(page.getByTestId('memory-details-panel')).toBeVisible()
})

test('vertical wheel suppresses momentum tail while horizontal wheel continues', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }),
      })
      return
    }
    await route.continue()
  })

  await page.goto('/')
  const surface = page.getByTestId('timeline-surface')

  const start0 = Number(await surface.getAttribute('data-start-ms'))
  await surface.dispatchEvent('wheel', { deltaY: -120, clientX: 500, clientY: 200 })
  const start1 = Number(await surface.getAttribute('data-start-ms'))
  expect(start1).not.toBe(start0)

  await surface.dispatchEvent('wheel', { deltaY: -8, clientX: 500, clientY: 200 })
  await surface.dispatchEvent('wheel', { deltaY: -4, clientX: 500, clientY: 200 })
  const start2 = Number(await surface.getAttribute('data-start-ms'))
  expect(start2).toBe(start1)

  await surface.dispatchEvent('wheel', { deltaX: -120, deltaY: 0, clientX: 500, clientY: 200 })
  const start3 = Number(await surface.getAttribute('data-start-ms'))
  expect(start3).not.toBe(start2)

  await surface.dispatchEvent('wheel', { deltaX: -8, deltaY: 0, clientX: 500, clientY: 200 })
  await surface.dispatchEvent('wheel', { deltaX: -4, deltaY: 0, clientX: 500, clientY: 200 })
  const start4 = Number(await surface.getAttribute('data-start-ms'))
  expect(start4).not.toBe(start3)
})
