import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

test('captures resize screenshot state', async ({ page }) => {
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
              id: 'theme-1',
              sessionId: 'timeline-main',
              startTime: '2026-01-01T00:00:00Z',
              endTime: '2026-06-01T00:00:00Z',
              title: 'Resizable',
              abbreviatedTitle: 'Res',
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
              id: 'theme-2',
              sessionId: 'timeline-main',
              startTime: '2026-06-02T00:00:00Z',
              endTime: '2026-06-20T00:00:00Z',
              title: 'Long Theme Title Without Short',
              abbreviatedTitle: null,
              tags: ['theme'],
              color: '#22c55e',
              opacity: 0.4,
              priority: 49,
              topPx: 124,
              bottomPx: 196,
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
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'Resize' }).click()
  const dir = path.join(process.cwd(), 'test-results', 'screenshots')
  mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, 'theme-resize-mode.png')
  await page.screenshot({ path: filePath, fullPage: true })
  await page.getByLabel('Theme: Resizable').click()
  const cornerPath = path.join(dir, 'theme-resize-corner-move.png')
  await page.screenshot({ path: cornerPath, fullPage: true })
  const titlePath = path.join(dir, 'theme-title-fallbacks.png')
  await page.screenshot({ path: titlePath, fullPage: true })
  await expect(page.getByLabel('Theme: Resizable')).toBeVisible()
})
