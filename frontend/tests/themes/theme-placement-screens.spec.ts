import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

test('captures placement screenshots', async ({ page }) => {
  let created = false
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
          themes: created
            ? [
                {
                  id: 't-1',
                  sessionId: 'timeline-main',
                  startTime: '2026-01-01T00:00:00Z',
                  endTime: '2026-06-01T00:00:00Z',
                  title: 'Untitled Theme',
                  description: '',
                  tags: ['theme'],
                  color: '#3b82f6',
                  opacity: 0.3,
                  priority: 100,
                  topPx: 120,
                  bottomPx: 220,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ]
            : [],
        }),
      })
      return
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON() as any
      created = true
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 't-1', sessionId: 'timeline-main', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...body }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'New Theme' }).click()
  const dir = path.join(process.cwd(), 'test-results', 'screenshots')
  mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, 'theme-placement-armed.png')
  await page.screenshot({ path: filePath, fullPage: true })
  await expect(page.getByRole('heading', { name: 'Timeline Navigator' })).toBeVisible()

  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  await page.mouse.move((box?.x ?? 0) + 320, (box?.y ?? 0) + 120)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 520, (box?.y ?? 0) + 180)
  await page.mouse.up()
  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
  await page.screenshot({ path: path.join(dir, 'theme-placement-after-drop.png'), fullPage: true })
})
