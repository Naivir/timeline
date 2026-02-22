import { expect, test } from '@playwright/test'
import { promises as fs } from 'node:fs'

test('captures sanity screenshots for theme flows and sidebar', async ({ page }, testInfo) => {
  const state = {
    memories: [
      {
        id: 'memory-sanity-1',
        sessionId: 'timeline-main',
        anchor: { type: 'point' as const, timestamp: '2026-03-01T00:00:00Z' },
        title: 'Overlay memory',
        description: 'memory should render above themes',
        tags: ['note'],
        verticalRatio: 0.32,
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-03-01T00:00:00Z',
      },
    ],
    themes: [
      {
        id: 'theme-base-1',
        sessionId: 'timeline-main',
        startTime: '2026-02-01T00:00:00Z',
        endTime: '2026-08-01T00:00:00Z',
        title: 'Base Theme',
        description: 'base layer',
        tags: ['arc'],
        color: '#3b82f6',
        opacity: 0.35,
        priority: 200,
        heightPx: 96,
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-02-01T00:00:00Z',
      },
      {
        id: 'theme-base-2',
        sessionId: 'timeline-main',
        startTime: '2026-03-15T00:00:00Z',
        endTime: '2026-09-15T00:00:00Z',
        title: 'Priority Theme',
        description: 'top layer',
        tags: ['focus'],
        color: '#f97316',
        opacity: 0.4,
        priority: 800,
        heightPx: 120,
        createdAt: '2026-03-02T00:00:00Z',
        updatedAt: '2026-03-02T00:00:00Z',
      },
    ],
  }

  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sessionId: 'timeline-main', memories: state.memories }),
      })
      return
    }
    await route.fulfill({ status: 204, body: '' })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sessionId: 'timeline-main', themes: state.themes }),
      })
      return
    }

    if (request.method() === 'POST') {
      const payload = request.postDataJSON() as any
      const created = {
        id: `theme-created-${state.themes.length + 1}`,
        sessionId: 'timeline-main',
        createdAt: '2026-03-10T00:00:00Z',
        updatedAt: '2026-03-10T00:00:00Z',
        ...payload,
      }
      state.themes = [...state.themes, created]
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(created) })
      return
    }

    if (request.method() === 'PATCH') {
      const payload = request.postDataJSON() as any
      const id = request.url().split('/').pop()!
      state.themes = state.themes.map((theme) =>
        theme.id === id ? { ...theme, ...payload, updatedAt: '2026-03-11T00:00:00Z' } : theme,
      )
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(state.themes.find((theme) => theme.id === id)),
      })
      return
    }

    if (request.method() === 'DELETE') {
      const id = request.url().split('/').pop()!
      state.themes = state.themes.filter((theme) => theme.id !== id)
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.continue()
  })

  const capture = async (name: string) => {
    const path = testInfo.outputPath(name)
    await page.screenshot({ path, fullPage: true })
    const stats = await fs.stat(path)
    expect(stats.size).toBeGreaterThan(0)
  }

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Timeline Navigator' })).toBeVisible()
  await capture('01-theme-base.png')

  await page.getByRole('button', { name: 'Actions' }).click()
  await expect(page.getByTestId('action-sidebar')).toBeVisible()
  await capture('02-actions-sidebar.png')

  await page.getByRole('button', { name: 'New Theme' }).click()
  await expect(page.getByText('Click and drag above timeline')).toBeVisible()
  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move((box?.x ?? 0) + 330, (box?.y ?? 0) + 130)
  await page.mouse.down()
  await page.mouse.move((box?.x ?? 0) + 560, (box?.y ?? 0) + 145)
  await page.mouse.up()

  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
  await capture('03-theme-create-popup.png')

  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Theme sanity')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByLabel('Theme: Theme sanity')).toBeVisible()
  await capture('04-theme-created.png')

  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByLabel('Theme: Priority Theme').click()
  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
  await capture('05-theme-details.png')

  await page.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByTestId('theme-confirm-modal')).toBeVisible()
  await capture('06-theme-delete-confirm.png')
})
