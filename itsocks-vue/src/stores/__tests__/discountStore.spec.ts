import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useDiscountStore } from '../discountStore'

// Mock productApi
vi.mock('@/api/productApi', () => ({
  productApi: {
    validateDiscount: vi.fn(),
  },
}))

import { productApi } from '@/api/productApi'

describe('discountStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('inicia sin descuento', () => {
    const discount = useDiscountStore()
    expect(discount.code).toBe('')
    expect(discount.discountAmount).toBe(0)
    expect(discount.applied).toBe(false)
    expect(discount.hasDiscount).toBe(false)
  })

  it('aplica descuento porcentual correctamente', async () => {
    vi.mocked(productApi.validateDiscount).mockResolvedValue({
      data: { valid: true, discount: 10, type: 'percentage', message: undefined },
    } as never)

    const discount = useDiscountStore()
    await discount.validateCode('TEST10', 100000)

    expect(discount.applied).toBe(true)
    expect(discount.code).toBe('TEST10')
    expect(discount.discountAmount).toBe(10000)
  })

  it('aplica descuento fijo correctamente', async () => {
    vi.mocked(productApi.validateDiscount).mockResolvedValue({
      data: { valid: true, discount: 5000, type: 'fixed', message: undefined },
    } as never)

    const discount = useDiscountStore()
    await discount.validateCode('FIJO5', 50000)

    expect(discount.discountAmount).toBe(5000)
    expect(discount.discountType).toBe('fixed')
  })

  it('no aplica descuento cuando el código es inválido', async () => {
    vi.mocked(productApi.validateDiscount).mockResolvedValue({
      data: { valid: false, discount: 0, type: 'percentage', message: 'Código inválido' },
    } as never)

    const discount = useDiscountStore()
    await discount.validateCode('INVALIDO', 100000)

    expect(discount.applied).toBe(false)
    expect(discount.discountAmount).toBe(0)
    expect(discount.error).toBe('Código inválido')
  })

  it('limpia el descuento correctamente', async () => {
    vi.mocked(productApi.validateDiscount).mockResolvedValue({
      data: { valid: true, discount: 10, type: 'percentage' },
    } as never)

    const discount = useDiscountStore()
    await discount.validateCode('TEST10', 100000)
    discount.clearDiscount()

    expect(discount.code).toBe('')
    expect(discount.discountAmount).toBe(0)
    expect(discount.applied).toBe(false)
  })

  it('maneja errores de red correctamente', async () => {
    vi.mocked(productApi.validateDiscount).mockRejectedValue(new Error('Network error'))

    const discount = useDiscountStore()
    await discount.validateCode('TEST10', 100000)

    expect(discount.applied).toBe(false)
    expect(discount.error).toBe('Error al validar el código')
  })
})
