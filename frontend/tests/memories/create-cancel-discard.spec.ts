import { expect, test } from '@playwright/test'

test('canceling initial memory creation confirms discard and removes memory', async ({ page }) => {
  let createdMemoryId: string | null = null
  let deleteCalls = 0
  const state: Array<{ id: string; title: string }> = []

  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: state.map((item) => ({
            id: item.id,
            sessionId: 'timeline-main',
            anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
            title: item.title,
            description: null,
            tags: ['draft'],
            verticalRatio: 0.5,
            createdAt: '2026-02-20T10:15:00Z',
            updatedAt: '2026-02-20T10:15:00Z',
          })),
        }),
      })
      return
    }

    if (request.method() === 'POST') {
      createdMemoryId = 'memory-cancel-1'
      state.push({ id: createdMemoryId, title: 'Untitled Memory' })
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: createdMemoryId,
          sessionId: 'timeline-main',
          anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
          title: 'Untitled Memory',
          description: null,
          tags: ['draft'],
          verticalRatio: 0.5,
          createdAt: '2026-02-20T10:15:00Z',
          updatedAt: '2026-02-20T10:15:00Z',
        }),
      })
      return
    }

    if (request.method() === 'DELETE') {
      deleteCalls += 1
      const url = request.url()
      if (createdMemoryId && url.includes(createdMemoryId)) {
        const index = state.findIndex((item) => item.id === createdMemoryId)
        if (index >= 0) state.splice(index, 1)
      }
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.continue()
  })

  await page.goto('/')
  await page.getByTestId('new-memory-button').click()
  await page.getByTestId('timeline-surface').click({ position: { x: 360, y: 160 } })

  await expect(page.getByRole('heading', { name: 'Edit Memory' })).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
  const confirm = page.getByTestId('memory-confirm-modal')
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Discard memory' }).click()

  await expect
    .poll(() => deleteCalls, {
      message: 'discard should call the delete API exactly once',
    })
    .toBe(1)
  await expect(page.getByTestId('memory-details-panel')).toBeHidden()
  await expect(page.getByLabel('Memory: Untitled Memory')).toHaveCount(0)
})
