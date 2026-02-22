import { expect, test } from '@playwright/test'

test('resize mode allows dragging memory horizontally and vertically', async ({ page }) => {
  let lastPatch: any = null

  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: [
            {
              id: 'memory-resize-1',
              sessionId: 'timeline-main',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: 'Resize target',
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
    if (request.method() === 'PATCH') {
      lastPatch = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'memory-resize-1',
          sessionId: 'timeline-main',
          anchor: lastPatch.anchor ?? { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
          title: 'Resize target',
          description: null,
          tags: ['note'],
          verticalRatio: lastPatch.verticalRatio ?? 0.35,
          createdAt: '2026-02-20T10:15:00Z',
          updatedAt: '2026-02-20T10:20:00Z',
        }),
      })
      return
    }
    await route.fulfill({ status: 204, body: '' })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [] }) })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByTestId('action-sidebar').getByRole('button', { name: 'Resize' }).click()

  const marker = page.getByLabel('Memory: Resize target')
  const boxBefore = await marker.boundingBox()
  expect(boxBefore).not.toBeNull()
  await page.mouse.move((boxBefore?.x ?? 0) + (boxBefore?.width ?? 0) / 2, (boxBefore?.y ?? 0) + (boxBefore?.height ?? 0) / 2)
  await page.mouse.down()
  await page.mouse.move(
    (boxBefore?.x ?? 0) + (boxBefore?.width ?? 0) / 2 + 60,
    (boxBefore?.y ?? 0) + (boxBefore?.height ?? 0) / 2 + 40,
  )
  const boxDuring = await marker.boundingBox()
  expect(boxDuring).not.toBeNull()
  expect(Math.abs((boxDuring?.x ?? 0) - (boxBefore?.x ?? 0))).toBeGreaterThan(10)
  await page.mouse.up()

  await expect.poll(() => lastPatch).not.toBeNull()
  expect(lastPatch.anchor?.type).toBe('point')
  expect(typeof lastPatch.verticalRatio).toBe('number')
  expect(lastPatch.verticalRatio).not.toBe(0.35)

  // Hover tooltip should be suppressed while resize mode is active.
  await page.mouse.move((boxDuring?.x ?? 0) + 8, (boxDuring?.y ?? 0) + 8)
  await expect(page.getByTestId('memory-hover-tooltip')).toHaveCount(0)
})
