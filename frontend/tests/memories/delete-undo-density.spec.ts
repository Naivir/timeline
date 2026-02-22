import { expect, test } from '@playwright/test'

test('deletes memory from details with final confirmation', async ({ page }) => {
  let deleteCalls = 0
  const state = {
    memories: [
      {
        id: 'memory-delete-1',
        sessionId: 'timeline-main',
        anchor: { type: 'point' as const, timestamp: '2026-02-20T10:15:00Z' },
        title: 'Delete target',
        description: 'to be removed',
        tags: ['note'],
        verticalRatio: 0.35,
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

    if (request.method() === 'DELETE') {
      deleteCalls += 1
      state.memories = []
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.continue()
  })

  await page.goto('/')
  await page.getByLabel('Memory: Delete target').click()
  await expect(page.getByTestId('memory-details-panel')).toBeVisible()

  await page.getByTestId('memory-details-panel').getByRole('button', { name: 'Delete' }).click()
  const confirm = page.getByTestId('memory-confirm-modal')
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Delete memory' }).click()
  await expect
    .poll(() => deleteCalls, {
      message: 'delete should call the delete API exactly once',
    })
    .toBe(1)
  await expect(page.getByLabel('Memory: Delete target')).toHaveCount(0)
  await expect(page.getByTestId('memory-undo-toast')).toHaveCount(0)
})
