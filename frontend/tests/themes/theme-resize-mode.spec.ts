import { expect, test } from '@playwright/test'

test('resize mode allows edge-driven and corner-driven theme updates', async ({ page }) => {
  let patchCount = 0
  let lastPatch: any = null
  const patchPayloads: any[] = []

  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          themes: [
            {
              id: 'theme-resize-1',
              sessionId: 'timeline-main',
              startTime: '2026-01-01T00:00:00Z',
              endTime: '2026-06-01T00:00:00Z',
              title: 'Resizable',
              description: null,
              tags: ['theme'],
              color: '#3b82f6',
              opacity: 0.4,
              priority: 500,
              heightPx: 120,
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
            },
          ],
        }),
      })
      return
    }
    if (request.method() === 'PATCH') {
      patchCount += 1
      lastPatch = request.postDataJSON()
      patchPayloads.push(lastPatch)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'theme-resize-1',
          sessionId: 'timeline-main',
          startTime: lastPatch.startTime ?? '2026-01-01T00:00:00Z',
          endTime: lastPatch.endTime ?? '2026-06-01T00:00:00Z',
          title: 'Resizable',
          description: null,
          tags: ['theme'],
          color: '#3b82f6',
          opacity: 0.4,
          priority: 500,
          heightPx: lastPatch.heightPx ?? 120,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-02T00:00:00Z',
        }),
      })
      return
    }
    await route.fulfill({ status: 204, body: '' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByTestId('action-sidebar').getByRole('button', { name: 'Resize' }).click()

  const block = page.getByLabel('Theme: Resizable')
  const box = await block.boundingBox()
  expect(box).not.toBeNull()

  // Drag right edge to resize span.
  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) - 2, (box?.y ?? 0) + (box?.height ?? 0) / 2)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) + 40, (box?.y ?? 0) + (box?.height ?? 0) / 2)
  await page.mouse.up()
  await expect.poll(() => patchCount).toBeGreaterThan(0)
  expect(lastPatch.startTime || lastPatch.endTime).toBeTruthy()

  // Drag top edge to resize height.
  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) + 2)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) - 30)
  await page.mouse.up()
  await expect.poll(() => patchCount).toBeGreaterThan(1)
  expect(typeof lastPatch.heightPx).toBe('number')

  // Corner option is exposed and draggable from explicit top-right handle.
  await block.click()
  const cornerHandle = page.locator('.theme-handle-corner-end').first()
  await expect(cornerHandle).toBeVisible()
  await expect(page.locator('.theme-handle-corner-start').first()).toBeVisible()
  const cornerBox = await cornerHandle.boundingBox()
  expect(cornerBox).not.toBeNull()
  const beforeCornerDragCount = patchCount
  await page.mouse.move((cornerBox?.x ?? 0) + 2, (cornerBox?.y ?? 0) + 2)
  await page.mouse.down()
  await page.mouse.move((cornerBox?.x ?? 0) + 28, (cornerBox?.y ?? 0) - 24)
  await page.mouse.up()
  await expect.poll(() => patchCount).toBeGreaterThanOrEqual(beforeCornerDragCount)

  // Hover title tooltip should be suppressed while resize mode is active.
  await expect(block).not.toHaveAttribute('title', /.+/)
})
