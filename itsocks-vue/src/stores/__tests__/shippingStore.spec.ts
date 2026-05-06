import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useShippingStore } from '../shippingStore'
import type { ShippingCity } from '@/types'

vi.mock('@/api/shippingApi', () => ({
  shippingApi: {
    getShippingRate: vi.fn().mockResolvedValue({
      data: { rate: 12000, estimated_days: 3 },
    }),
  },
}))

const mockCity = (id = 1): ShippingCity => ({
  id,
  name: 'Bogotá',
  department: 'Bogotá D.C.',
  rate: 8000,
  estimated_days: 2,
})

describe('shippingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia sin envío seleccionado', () => {
    const shipping = useShippingStore()
    expect(shipping.selectedCity).toBeNull()
    expect(shipping.shippingRate).toBe(0)
    expect(shipping.hasShipping).toBe(false)
  })

  it('establece ciudad y tarifa', () => {
    const shipping = useShippingStore()
    shipping.setCity(mockCity())
    expect(shipping.selectedCity?.name).toBe('Bogotá')
    expect(shipping.shippingRate).toBe(8000)
    expect(shipping.hasShipping).toBe(true)
  })

  it('limpia ciudad al cambiar departamento', () => {
    const shipping = useShippingStore()
    shipping.setCity(mockCity())
    shipping.setDepartment('Antioquia')
    expect(shipping.selectedCity).toBeNull()
    expect(shipping.shippingRate).toBe(0)
    expect(shipping.selectedDepartment).toBe('Antioquia')
  })

  it('obtiene tarifa de envío de la API', async () => {
    const shipping = useShippingStore()
    await shipping.fetchRate(1)
    expect(shipping.shippingRate).toBe(12000)
    expect(shipping.estimatedDays).toBe(3)
  })

  it('limpia el estado de envío', () => {
    const shipping = useShippingStore()
    shipping.setCity(mockCity())
    shipping.clearShipping()
    expect(shipping.selectedCity).toBeNull()
    expect(shipping.shippingRate).toBe(0)
  })
})
