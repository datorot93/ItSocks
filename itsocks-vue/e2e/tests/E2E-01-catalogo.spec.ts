import { test, expect } from '@playwright/test'

test('E2E-01: Explorar catálogo y ver detalle de producto', async ({ page }) => {
  await page.goto('/medias/estampadas')

  // Wait for products to load
  await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 15000 })

  // Click on first product
  await page.locator('[data-testid="product-card"]').first().click()

  // Verify product detail page
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
  await expect(page.locator('[data-testid="size-selector"]')).toBeVisible()
  await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible()
})
