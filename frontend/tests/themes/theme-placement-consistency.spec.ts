import { expect, test } from '@playwright/test'

test('theme create and resize remain consistent across interactions', async ({ page }) => {
  let themes: any[] = []
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes }) })
      return
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON() as any
      themes = [{ id: 'theme-1', sessionId: 'timeline-main', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...body }]
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(themes[0]) })
      return
    }
    if (request.method() === 'PATCH') {
      const patch = request.postDataJSON() as any
      themes = themes.map((t) => ({ ...t, ...patch, updatedAt: new Date().toISOString() }))
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(themes[0]) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'New Theme' }).click()
  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  await page.mouse.move((box?.x ?? 0) + 300, (box?.y ?? 0) + 120)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 500, (box?.y ?? 0) + 170)
  await page.mouse.up()
  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
})

test('resize mode dragging theme body performs horizontal and vertical translation', async ({ page }) => {
  let lastPatch: any = null
  let themes: any[] = [
    {
      id: 'theme-1',
      sessionId: 'timeline-main',
      startTime: '2026-01-01T00:00:00Z',
      endTime: '2026-06-01T00:00:00Z',
      title: 'Moveable',
      tags: ['theme'],
      color: '#3b82f6',
      opacity: 0.4,
      priority: 50,
      topPx: 120,
      bottomPx: 220,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ]
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes }) })
      return
    }
    if (request.method() === 'PATCH') {
      lastPatch = request.postDataJSON() as any
      themes = themes.map((t) => ({ ...t, ...lastPatch, updatedAt: new Date().toISOString() }))
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(themes[0]) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'Resize' }).click()

  const block = page.getByLabel('Theme: Moveable')
  const box = await block.boundingBox()
  expect(box).not.toBeNull()

  await page.mouse.move((box?.x ?? 0) + 80, (box?.y ?? 0) + 60)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 82, (box?.y ?? 0) + 96)
  await page.mouse.up()

  await expect.poll(() => lastPatch).not.toBeNull()
  expect(lastPatch.topPx).toBeDefined()
  expect(lastPatch.bottomPx).toBeDefined()
  expect(lastPatch.startTime).toBeDefined()
  expect(lastPatch.endTime).toBeDefined()
})

test('title rendering uses abbreviated fallback and tooltip-only without abbreviated title', async ({ page }) => {
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
              id: 'theme-a',
              sessionId: 'timeline-main',
              startTime: '2026-01-01T00:00:00Z',
              endTime: '2026-03-01T00:00:00Z',
              title: 'Learning the Language of Light and Motion',
              abbreviatedTitle: 'Light',
              tags: ['theme'],
              color: '#3b82f6',
              opacity: 0.4,
              priority: 50,
              topPx: 120,
              bottomPx: 220,
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
            },
            {
              id: 'theme-b',
              sessionId: 'timeline-main',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-20T00:00:00Z',
              title: 'A Very Long Theme Name Without Abbreviation',
              abbreviatedTitle: null,
              tags: ['theme'],
              color: '#22c55e',
              opacity: 0.4,
              priority: 49,
              topPx: 120,
              bottomPx: 220,
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
            },
          ],
        }),
      })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await expect(page.getByText('Light')).toBeVisible()
  const fallbackBlock = page.locator('[data-theme-id=\"theme-b\"]')
  await expect(fallbackBlock).toHaveAttribute('title', 'A Very Long Theme Name Without Abbreviation')
})
