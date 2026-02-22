import { expect, test } from '@playwright/test'

const iso = '2026-01-10T00:00:00Z'

test('upward and downward theme drag create emits geometry payload', async ({ page }) => {
  const posted: any[] = []

  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [] }) })
      return
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON() as any
      posted.push(body)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: `t-${posted.length}`, sessionId: 'timeline-main', createdAt: iso, updatedAt: iso, ...body }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'New Theme' }).click()

  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  expect(box).not.toBeNull()

  await page.mouse.move((box?.x ?? 0) + 280, (box?.y ?? 0) + 100)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 520, (box?.y ?? 0) + 180)
  await page.mouse.up()

  await expect.poll(() => posted.length).toBeGreaterThan(0)
  expect(posted[0].topPx).toBeLessThan(posted[0].bottomPx)
})

test('theme create commits on pointer release after moving off surface', async ({ page }) => {
  let postCount = 0

  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [] }) })
      return
    }
    if (request.method() === 'POST') {
      postCount += 1
      const body = request.postDataJSON() as any
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 't-offsurface', sessionId: 'timeline-main', createdAt: iso, updatedAt: iso, ...body }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'New Theme' }).click()

  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  expect(box).not.toBeNull()

  await page.mouse.move((box?.x ?? 0) + 300, (box?.y ?? 0) + 110)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) + 30, (box?.y ?? 0) + 190)
  await page.mouse.up()

  await expect.poll(() => postCount).toBe(1)
  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
})
