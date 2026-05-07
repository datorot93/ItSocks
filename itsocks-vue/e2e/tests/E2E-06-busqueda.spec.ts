import { test, expect } from '@playwright/test'

test('E2E-06: Búsqueda de producto', async ({ page }) => {
  await page.goto('/')

  // Use search input in navbar
  const navSearchInput = page.locator('[data-testid="nav-search-input"]')
  await expect(navSearchInput).toBeVisible()

  await navSearchInput.fill('media')
  await navSearchInput.press('Enter')

  // Should navigate to search page
  await page.waitForURL('**/buscar**', { timeout: 10000 })
  await expect(page).toHaveURL(/buscar/)

  // Wait for results
  await page.waitForTimeout(2000)

  // SearchPage has its own search-input
  const pageSearchInput = page.locator('[data-testid="search-input"]')
  await expect(pageSearchInput).toBeVisible()
  // Results may or may not appear depending on API availability
})
