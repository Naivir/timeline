import { expect, test } from '@playwright/test'

test.describe('timeline smoke', () => {
  test('loads baseline timeline from API', async ({ page }) => {
    await page.route('**/api/v1/timeline', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          timeline: {
            id: 'timeline-main',
            title: 'My Timeline',
            startLabel: 'Past',
            endLabel: 'Future',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          baseline: {
            orientation: 'horizontal',
            positionPercent: 50,
            thicknessPx: 4,
            lengthPercent: 92
          },
          eventPlaceholders: [],
          meta: { requestId: 'smoke-id' }
        })
      })
    })

    await page.goto('/')
    await expect(page.getByLabel('Base timeline line')).toBeVisible()
  })

  test('shows retry banner when API fails', async ({ page }) => {
    const failHandler = async (route: Parameters<typeof page.route>[1] extends (arg: infer A) => unknown ? A : never) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'SERVICE_UNAVAILABLE', message: 'Service down' })
      })
    }

    await page.route('**/api/v1/timeline', failHandler)

    await page.goto('/')
    await expect(page.getByRole('alert')).toBeVisible()

    await page.unroute('**/api/v1/timeline', failHandler)
    await page.route('**/api/v1/timeline', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          timeline: {
            id: 'timeline-main',
            title: 'My Timeline',
            startLabel: 'Past',
            endLabel: 'Future',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          baseline: {
            orientation: 'horizontal',
            positionPercent: 50,
            thicknessPx: 4,
            lengthPercent: 92
          },
          eventPlaceholders: [],
          meta: { requestId: 'smoke-retry' }
        })
      })
    })

    await page.getByRole('button', { name: 'Retry Timeline Load' }).click()
    await expect(page.getByLabel('Base timeline line')).toBeVisible()
  })
})
