import { expect, test } from '@playwright/test'

const iso = '2026-01-10T00:00:00Z'

test('drag-create theme opens edit popup and saves', async ({ page }) => {
  let themes: any[] = []

  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
      return
    }
    await route.fulfill({ status: 204, body: '' })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes }) })
      return
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON() as any
      const created = {
        id: `theme-${themes.length + 1}`,
        sessionId: 'timeline-main',
        createdAt: iso,
        updatedAt: iso,
        ...body,
      }
      themes = [...themes, created]
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(created) })
      return
    }
    if (request.method() === 'PATCH') {
      const patch = request.postDataJSON() as any
      const id = request.url().split('/').pop()!
      themes = themes.map((theme) => (theme.id === id ? { ...theme, ...patch, updatedAt: iso } : theme))
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(themes.find((item) => item.id === id)) })
      return
    }
    if (request.method() === 'DELETE') {
      const id = request.url().split('/').pop()!
      themes = themes.filter((theme) => theme.id !== id)
      await route.fulfill({ status: 204, body: '' })
      return
    }
    await route.continue()
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('button', { name: 'New Theme' }).click()

  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move((box?.x ?? 0) + 300, (box?.y ?? 0) + 120)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 520, (box?.y ?? 0) + 128)
  await page.mouse.up()

  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
  await page.getByRole('textbox', { name: 'Title' }).fill('Travel arc')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByTestId('theme-block').first()).toBeVisible()
})
