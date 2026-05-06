import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import { usePackStore } from '../packStore'
import type { Pack } from '@/types'

const mockPack = (): Pack => ({
  id: 1,
  name: 'Pack Test',
  slug: 'pack-test',
  price: 90000,
  images: [],
  products: [],
  description: 'Pack de prueba',
  discount_percentage: 10,
})

describe('packStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia sin pack seleccionado', () => {
    const pack = usePackStore()
    expect(pack.selectedPack).toBeNull()
  })

  it('establece el pack seleccionado', () => {
    const pack = usePackStore()
    const p = mockPack()
    pack.setSelectedPack(p)
    expect(pack.selectedPack?.id).toBe(1)
    expect(pack.selectedPack?.name).toBe('Pack Test')
  })

  it('limpia el pack seleccionado', () => {
    const pack = usePackStore()
    pack.setSelectedPack(mockPack())
    pack.clearPack()
    expect(pack.selectedPack).toBeNull()
  })
})
