import { test, expect } from '@playwright/test'

test.describe('create class', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/createclass')
  })
  test('fill informations', async ({ page }) => {
    const startDate = '2024-11-16'
    const endDate = '2024-11-20'

    const startDateInput = page.locator('input[type="date"]').first()
    await startDateInput.fill(startDate)

    const endDateInput = page.locator('input[type="date"]').nth(1)
    await expect(endDateInput).not.toBeDisabled()

    await endDateInput.fill(endDate)

    await expect(startDateInput).toHaveValue(startDate)
    await expect(endDateInput).toHaveValue(endDate)
  })
})
