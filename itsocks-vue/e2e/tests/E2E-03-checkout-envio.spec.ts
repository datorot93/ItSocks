import { test, expect } from '@playwright/test'
import { clearCart, addProductToCart } from '../helpers/cart'
import { TEST_CUSTOMER, TEST_DEPARTMENT, TEST_CITY } from '../fixtures/index'

test('E2E-03: Carrito → Checkout → verificar formulario de envío', async ({ page }) => {
  await page.goto('/')
  await clearCart(page)
  await addProductToCart(page)

  await page.goto('/checkout')
  await expect(page.locator('[data-testid="input-name"]')).toBeVisible({ timeout: 10000 })

  // Fill form
  await page.locator('[data-testid="input-name"]').fill(TEST_CUSTOMER.name)
  await page.locator('[data-testid="input-lastname"]').fill(TEST_CUSTOMER.lastName)
  await page.locator('[data-testid="input-email"]').fill(TEST_CUSTOMER.email)
  await page.locator('[data-testid="input-phone"]').fill(TEST_CUSTOMER.phone)

  // Select department
  const deptSelect = page.locator('[data-testid="department-select"]')
  await expect(deptSelect).toBeVisible()

  const deptOptions = await deptSelect.locator('option').count()
  if (deptOptions > 1) {
    await deptSelect.selectOption({ index: 1 })
    await page.waitForTimeout(1500)

    const citySelect = page.locator('[data-testid="city-select"]')
    const cityOptions = await citySelect.locator('option').count()
    if (cityOptions > 1) {
      await citySelect.selectOption({ index: 1 })
      await page.waitForTimeout(500)
    }
  }

  // Verify order total is visible
  await expect(page.locator('[data-testid="order-total"]')).toBeVisible()
  await expect(page.locator('[data-testid="next-step-btn"]')).toBeVisible()
})
