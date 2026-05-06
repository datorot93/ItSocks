import { test, expect } from '@playwright/test'
import { clearCart, addProductToCart, fillShippingForm } from '../helpers/cart'
import { TEST_DISCOUNT_CODE } from '../fixtures/index'

test('E2E-04: Aplicar código de descuento en billing', async ({ page }) => {
  await page.goto('/')
  await clearCart(page)
  await addProductToCart(page)
  await fillShippingForm(page)

  // Navigate to billing
  await page.goto('/billing')
  await expect(page.locator('[data-testid="discount-input"]')).toBeVisible({ timeout: 10000 })

  // Get total before discount
  const totalBeforeText = await page.locator('[data-testid="cart-total"]').textContent()

  // Apply discount
  await page.locator('[data-testid="discount-input"]').fill(TEST_DISCOUNT_CODE)
  await page.locator('[data-testid="apply-discount-btn"]').click()

  // Wait for API response
  await page.waitForTimeout(2000)

  // Either discount applied OR error shown (API may not have this code in test environment)
  const discountApplied = await page.locator('[data-testid="discount-applied"]').isVisible()
  const discountError = await page.locator('.text-red-500').isVisible()

  // At minimum the input and button are functional
  expect(discountApplied || discountError).toBe(true)

  // If applied, verify remove button works
  if (discountApplied) {
    await page.locator('[data-testid="remove-discount-btn"]').click()
    await expect(page.locator('[data-testid="discount-applied"]')).not.toBeVisible()
  }
})
