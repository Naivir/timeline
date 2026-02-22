import { expect, test } from '@playwright/test'

test.describe('timeline live backend', () => {
  test('renders timeline and reaches backend memory/theme endpoints', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByLabel('Timeline axis')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Timeline Navigator' })).toBeVisible()
    await expect(page.getByTestId('new-memory-button')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Actions' })).toBeVisible()

    const health = await page.request.get('http://127.0.0.1:8000/api/v1/health')
    expect(health.ok()).toBeTruthy()

    const memories = await page.request.get('http://127.0.0.1:8000/api/v1/sessions/timeline-main/memories')
    expect(memories.ok()).toBeTruthy()
    const memoriesPayload = await memories.json()
    expect(Array.isArray(memoriesPayload.memories)).toBeTruthy()

    const themes = await page.request.get('http://127.0.0.1:8000/api/v1/sessions/timeline-main/themes')
    expect(themes.ok()).toBeTruthy()
    const themesPayload = await themes.json()
    expect(Array.isArray(themesPayload.themes)).toBeTruthy()
  })
})
