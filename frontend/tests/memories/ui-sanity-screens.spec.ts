import { expect, test } from '@playwright/test'
import { promises as fs } from 'node:fs'

test('captures sanity screenshots for timeline and memory popups', async ({ page }, testInfo) => {
  const state = {
    memories: [
      {
        id: 'memory-initial-1',
        sessionId: 'timeline-main',
        anchor: { type: 'point' as const, timestamp: '2026-02-20T10:15:00Z' },
        title: 'Existing memory',
        description: 'Original description',
        tags: ['note'],
        verticalRatio: 0.34,
        createdAt: '2026-02-20T10:15:00Z',
        updatedAt: '2026-02-20T10:15:00Z',
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

    if (request.method() === 'POST') {
      const payload = request.postDataJSON() as {
        anchor: { type: 'point'; timestamp: string }
        verticalRatio?: number
      }
      const created = {
        id: `memory-created-${state.memories.length + 1}`,
        sessionId: 'timeline-main',
        anchor: payload.anchor,
        title: 'Untitled Memory',
        description: null,
        tags: ['note'],
        verticalRatio: payload.verticalRatio ?? 0.5,
        createdAt: '2026-02-20T10:15:00Z',
        updatedAt: '2026-02-20T10:15:00Z',
      }
      state.memories = [...state.memories, created]
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(created) })
      return
    }

    if (request.method() === 'PATCH') {
      const payload = request.postDataJSON() as {
        title?: string
        description?: string
        tags?: string[]
      }
      const updated = {
        ...state.memories[state.memories.length - 1],
        title: payload.title ?? state.memories[state.memories.length - 1].title,
        description: payload.description ?? state.memories[state.memories.length - 1].description,
        tags: payload.tags ?? state.memories[state.memories.length - 1].tags,
        updatedAt: '2026-02-20T10:20:00Z',
      }
      state.memories[state.memories.length - 1] = updated
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(updated) })
      return
    }

    if (request.method() === 'DELETE') {
      const target = state.memories[state.memories.length - 1] ?? null
      if (target) {
        state.memories = state.memories.filter((memory) => memory.id !== target.id)
      }
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.continue()
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ sessionId: 'timeline-main', themes: [] }),
    })
  })

  const capture = async (name: string) => {
    const path = testInfo.outputPath(name)
    await page.screenshot({ path, fullPage: true })
    const stats = await fs.stat(path)
    expect(stats.size).toBeGreaterThan(0)
  }

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Timeline Navigator' })).toBeVisible()

  const headerBox = await page.locator('header.timeline-header').boundingBox()
  const surfaceBox = await page.getByTestId('timeline-surface').boundingBox()
  const viewport = page.viewportSize()
  expect(headerBox).not.toBeNull()
  expect(surfaceBox).not.toBeNull()
  expect((headerBox?.y ?? 0)).toBeLessThanOrEqual(20)
  expect((headerBox?.height ?? 0)).toBeLessThanOrEqual((viewport?.height ?? 0) * 0.2)

  await capture('01-base-screen.png')

  await page.getByTestId('new-memory-button').click()
  await expect(page.getByText('Click timeline to place memory')).toBeVisible()
  await capture('02-placement-mode.png')

  await page.getByTestId('timeline-surface').click({ position: { x: 520, y: 180 } })
  await expect(page.getByTestId('memory-marker').last()).toBeVisible()
  await capture('03-memory-placed.png')

  await expect(page.getByTestId('memory-details-panel')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Edit Memory' })).toBeVisible()
  const panelBox = await page.getByTestId('memory-details-panel').boundingBox()
  expect(viewport).not.toBeNull()
  expect(panelBox).not.toBeNull()
  const viewportCenterX = (viewport?.width ?? 0) / 2
  const viewportCenterY = (viewport?.height ?? 0) / 2
  const panelCenterX = (panelBox?.x ?? 0) + (panelBox?.width ?? 0) / 2
  const panelCenterY = (panelBox?.y ?? 0) + (panelBox?.height ?? 0) / 2
  expect(Math.abs(panelCenterX - viewportCenterX)).toBeLessThanOrEqual(80)
  expect(Math.abs(panelCenterY - viewportCenterY)).toBeLessThanOrEqual(80)
  await capture('04-create-edit-popup.png')

  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Placed memory')
  await page.getByRole('textbox', { name: 'Description', exact: true }).fill('Placed via click')
  await page.getByRole('textbox', { name: 'Tags', exact: true }).fill('note, travel')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Placed memory')).toBeVisible()

  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByLabel('Memory: Placed memory').click()
  const panel = page.getByTestId('memory-details-panel')
  await expect(page.getByRole('heading', { name: 'Memory Details' })).toBeVisible()
  await expect(panel.getByText('note, travel')).toBeVisible()
  await expect(panel.getByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i)).toBeVisible()
  await expect(panel.getByText(/T10:15:00Z/)).toHaveCount(0)
  await capture('05-memory-inspect-popup.png')

  await page.getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByRole('heading', { name: 'Edit Memory' })).toBeVisible()
  await capture('06-memory-edit-popup.png')

  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.getByRole('button', { name: 'Delete' }).click()
  const confirm = page.getByTestId('memory-confirm-modal')
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Delete memory' }).click()
  await expect(page.getByLabel('Memory: Placed memory')).toHaveCount(0)
  await expect(page.getByTestId('memory-undo-toast')).toHaveCount(0)
  await capture('07-delete-final.png')
})
