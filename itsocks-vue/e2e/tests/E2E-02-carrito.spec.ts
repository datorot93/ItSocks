import { test, expect } from '@playwright/test'
import { clearCart, addProductToCart } from '../helpers/cart'

test('E2E-02: Agregar producto al carrito y verificar qty', async ({ page }) => {
  await page.goto('/')
  await clearCart(page)

  await page.goto('/medias/estampadas')
  await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 15000 })

  // Go to first product detail
  await page.locator('[data-testid="product-card"]').first().click()
  await expect(page.locator('[data-testid="size-selector"]')).toBeVisible({ timeout: 10000 })

  // Select first available size
  await page.locator('[data-testid="size-selector"] button').first().click()

  // Add to cart
  await page.locator('[data-testid="add-to-cart-btn"]').click()
  await page.waitForTimeout(500)

  // Cart count should show 1
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')

  // Go to cart
  await page.goto('/carrito')
  await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()

  // Increase quantity
  await page.locator('[data-testid="qty-increase"]').click()
  await expect(page.locator('[data-testid="cart-item-qty"]')).toHaveText('2')

  // Remove item
  await page.locator('[data-testid="remove-item-btn"]').click()
  await expect(page.locator('[data-testid="cart-empty"]')).toBeVisible()
})
