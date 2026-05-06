import { type Page } from '@playwright/test'
import { TEST_CUSTOMER, TEST_DEPARTMENT, TEST_CITY } from '../fixtures/index'

export async function clearCart(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('cart')
    localStorage.removeItem('shipping')
    localStorage.removeItem('discount')
    localStorage.removeItem('preference')
    sessionStorage.removeItem('checkout_shipping')
  })
}

export async function mockMercadoPago(page: Page) {
  await page.route('https://sdk.mercadopago.com/js/v2', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.MercadoPago = function(key, opts) {
          this.bricks = function() {
            return {
              create: async function(type, containerId, config) {
                var id = containerId.replace('#', '');
                var el = document.getElementById(id);
                if (el) {
                  el.innerHTML = '<button id="mp-wallet-stub" data-testid="mp-wallet">Pagar con MercadoPago (TEST)</button>';
                }
                if (config && config.callbacks && config.callbacks.onReady) {
                  config.callbacks.onReady();
                }
                return { unmount: function() {} };
              }
            };
          };
        };
      `,
    })
  })
}

export async function addProductToCart(page: Page) {
  await page.goto('/medias/estampadas')
  await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 })
  await page.locator('[data-testid="product-card"]').first().click()
  await page.waitForSelector('[data-testid="size-selector"]', { timeout: 10000 })
  const sizeBtn = page.locator('[data-testid="size-selector"] button').first()
  await sizeBtn.click()
  await page.locator('[data-testid="add-to-cart-btn"]').click()
  await page.waitForTimeout(500)
}

export async function fillShippingForm(page: Page) {
  await page.goto('/checkout')
  await page.locator('[data-testid="input-name"]').fill(TEST_CUSTOMER.name)
  await page.locator('[data-testid="input-lastname"]').fill(TEST_CUSTOMER.lastName)
  await page.locator('[data-testid="input-email"]').fill(TEST_CUSTOMER.email)
  await page.locator('[data-testid="input-phone"]').fill(TEST_CUSTOMER.phone)

  const deptSelect = page.locator('[data-testid="department-select"]')
  const deptOptions = await deptSelect.locator('option').count()

  if (deptOptions > 1) {
    // Try to select the test department, fallback to first available
    const optValues = await deptSelect.locator('option').allTextContents()
    const found = optValues.find((v) => v.includes(TEST_DEPARTMENT))
    if (found) {
      await deptSelect.selectOption({ label: found })
    } else {
      await deptSelect.selectOption({ index: 1 })
    }
    await page.waitForTimeout(1000)
    const citySelect = page.locator('[data-testid="city-select"]')
    const cityOptions = await citySelect.locator('option').count()
    if (cityOptions > 1) {
      await citySelect.selectOption({ index: 1 })
    }
  }

  await page.waitForTimeout(500)
}
