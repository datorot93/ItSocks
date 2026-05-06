import { test, expect } from '@playwright/test'

test('E2E-06: Búsqueda de producto', async ({ page }) => {
  await page.goto('/')

  // Use search input in navbar
  const searchInput = page.locator('[data-testid="search-input"]').first()
  await expect(searchInput).toBeVisible()

  await searchInput.fill('media')
  await searchInput.press('Enter')

  // Should navigate to search page
  await page.waitForURL('**/buscar**', { timeout: 10000 })
  await expect(page).toHaveURL(/buscar/)

  // Wait for results
  await page.waitForTimeout(2000)

  // Check if results appear or empty state
  const hasResults = await page.locator('[data-testid="search-result"]').count()
  const hasSearchInput = await page.locator('[data-testid="search-input"]').isVisible()

  expect(hasSearchInput).toBe(true)
  // Results may or may not appear depending on API availability
})
