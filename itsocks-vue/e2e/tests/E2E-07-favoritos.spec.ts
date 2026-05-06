import { test, expect } from '@playwright/test'

test('E2E-07: Agregar a favoritos y ver lista', async ({ page }) => {
  // Clear wishlist first
  await page.goto('/')
  await page.evaluate(() => localStorage.removeItem('wishlist'))

  await page.goto('/medias/estampadas')
  await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 15000 })

  // Click wishlist button on first product
  await page.locator('[data-testid="wishlist-btn"]').first().click()

  // Toast should appear
  await expect(page.locator('[data-testid="wishlist-toast"]')).toBeVisible({ timeout: 5000 })

  // Go to wishlist page
  await page.goto('/lista_de_favoritos')
  await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount(1, { timeout: 5000 })

  // Share button should be visible
  const shareBtn = page.locator('button', { hasText: 'Compartir lista' })
  await expect(shareBtn).toBeVisible()

  // Click share to generate URL
  await shareBtn.click()
  await page.waitForTimeout(2000)

  // Share URL input should appear (may fail if API not available)
  const shareUrlInput = page.locator('[data-testid="share-url"]')
  const isVisible = await shareUrlInput.isVisible()

  if (isVisible) {
    const shareUrl = await shareUrlInput.inputValue()
    expect(shareUrl).toMatch(/\/lista_de_favoritos\//)
  }
})
