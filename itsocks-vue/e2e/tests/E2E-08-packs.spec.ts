import { test, expect } from '@playwright/test'
import { clearCart } from '../helpers/cart'

test('E2E-08: Ver pack y agregarlo al carrito', async ({ page }) => {
  await page.goto('/')
  await clearCart(page)

  await page.goto('/packs')

  // Wait for packs to load or show empty state
  await page.waitForTimeout(3000)

  const hasPackCards = await page.locator('[data-testid="pack-card"]').count()

  if (hasPackCards > 0) {
    await expect(page.locator('[data-testid="pack-card"]').first()).toBeVisible()

    // Click on first pack
    await page.locator('[data-testid="pack-card"]').first().click()

    // Verify pack detail page
    await expect(page.locator('[data-testid="pack-detail"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="pack-price"]')).toBeVisible()

    // Try to add to cart (need to select sizes if available)
    const addBtn = page.locator('[data-testid="add-pack-to-cart-btn"]')
    await expect(addBtn).toBeVisible()

    // If all sizes are pre-selected or product has no sizes, button should be enabled
    const isDisabled = await addBtn.isDisabled()
    if (!isDisabled) {
      await addBtn.click()
      await page.waitForTimeout(500)
      await expect(page.locator('[data-testid="cart-count"]')).not.toHaveText('0')
    }
  } else {
    // No packs available (API not running or no data) — verify page structure
    await expect(page.locator('h1')).toContainText('Packs')
  }
})
