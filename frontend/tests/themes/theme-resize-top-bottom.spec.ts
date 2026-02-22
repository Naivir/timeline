import { expect, test } from '@playwright/test'

test('resize mode allows top and bottom edge drag', async ({ page }) => {
  let lastPatch: any = null
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [{ id: 'theme-1', sessionId: 'timeline-main', startTime: '2026-01-01T00:00:00Z', endTime: '2026-06-01T00:00:00Z', title: 'Resizable', tags: ['theme'], color: '#3b82f6', opacity: 0.4, priority: 50, topPx: 120, bottomPx: 220, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }] }) })
      return
    }
    if (request.method() === 'PATCH') {
      lastPatch = request.postDataJSON()
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'theme-1', sessionId: 'timeline-main', startTime: lastPatch.startTime ?? '2026-01-01T00:00:00Z', endTime: lastPatch.endTime ?? '2026-06-01T00:00:00Z', title: 'Resizable', tags: ['theme'], color: '#3b82f6', opacity: 0.4, priority: 50, topPx: lastPatch.topPx ?? 120, bottomPx: lastPatch.bottomPx ?? 220, createdAt: '2026-01-01T00:00:00Z', updatedAt: new Date().toISOString() }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'Resize' }).click()

  const block = page.getByLabel('Theme: Resizable')
  const box = await block.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move((box?.x ?? 0) + 10, (box?.y ?? 0) + 2)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 10, (box?.y ?? 0) - 20)
  await page.mouse.up()

  await expect.poll(() => lastPatch).not.toBeNull()
  expect(lastPatch.topPx ?? lastPatch.bottomPx).toBeDefined()
})

test('resize mode bottom corner drag updates horizontal edge and bottom together', async ({ page }) => {
  let lastPatch: any = null
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [{ id: 'theme-1', sessionId: 'timeline-main', startTime: '2026-01-01T00:00:00Z', endTime: '2026-06-01T00:00:00Z', title: 'Resizable', tags: ['theme'], color: '#3b82f6', opacity: 0.4, priority: 50, topPx: 120, bottomPx: 220, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }] }) })
      return
    }
    if (request.method() === 'PATCH') {
      lastPatch = request.postDataJSON()
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'theme-1', sessionId: 'timeline-main', startTime: lastPatch.startTime ?? '2026-01-01T00:00:00Z', endTime: lastPatch.endTime ?? '2026-06-01T00:00:00Z', title: 'Resizable', tags: ['theme'], color: '#3b82f6', opacity: 0.4, priority: 50, topPx: lastPatch.topPx ?? 120, bottomPx: lastPatch.bottomPx ?? 220, createdAt: '2026-01-01T00:00:00Z', updatedAt: new Date().toISOString() }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'Resize' }).click()
  await page.getByLabel('Theme: Resizable').click()

  const handle = page.locator('.theme-handle-corner-start').first()
  const handleBox = await handle.boundingBox()
  expect(handleBox).not.toBeNull()
  await page.mouse.move((handleBox?.x ?? 0) + 4, (handleBox?.y ?? 0) + 4)
  await page.mouse.down()
  await page.mouse.move((handleBox?.x ?? 0) - 30, (handleBox?.y ?? 0) + 22)
  await page.mouse.up()

  await expect.poll(() => lastPatch).not.toBeNull()
  expect(lastPatch.startTime).toBeDefined()
  expect(lastPatch.bottomPx).toBeDefined()
  expect(lastPatch.topPx).toBeDefined()
})

test('resize mode top corner drag remains available and updates horizontal edge and top', async ({ page }) => {
  let lastPatch: any = null
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [{ id: 'theme-1', sessionId: 'timeline-main', startTime: '2026-01-01T00:00:00Z', endTime: '2026-06-01T00:00:00Z', title: 'Resizable', tags: ['theme'], color: '#3b82f6', opacity: 0.4, priority: 50, topPx: 120, bottomPx: 220, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }] }) })
      return
    }
    if (request.method() === 'PATCH') {
      lastPatch = request.postDataJSON()
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'theme-1', sessionId: 'timeline-main', startTime: lastPatch.startTime ?? '2026-01-01T00:00:00Z', endTime: lastPatch.endTime ?? '2026-06-01T00:00:00Z', title: 'Resizable', tags: ['theme'], color: '#3b82f6', opacity: 0.4, priority: 50, topPx: lastPatch.topPx ?? 120, bottomPx: lastPatch.bottomPx ?? 220, createdAt: '2026-01-01T00:00:00Z', updatedAt: new Date().toISOString() }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'Resize' }).click()
  await page.getByLabel('Theme: Resizable').click()

  const handle = page.locator('.theme-handle-corner-top-start').first()
  const handleBox = await handle.boundingBox()
  expect(handleBox).not.toBeNull()
  await page.mouse.move((handleBox?.x ?? 0) + 4, (handleBox?.y ?? 0) + 4)
  await page.mouse.down()
  await page.mouse.move((handleBox?.x ?? 0) - 20, (handleBox?.y ?? 0) - 20)
  await page.mouse.up()

  await expect.poll(() => lastPatch).not.toBeNull()
  expect(lastPatch.startTime).toBeDefined()
  expect(lastPatch.topPx).toBeDefined()
})
