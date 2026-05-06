import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useWishlistStore } from '../wishlistStore'
import type { Product } from '@/types'

vi.mock('@/api/wishlistApi', () => ({
  wishlistApi: {
    createWishlist: vi.fn().mockResolvedValue({ data: { token: 'abc-123', items: [] } }),
  },
}))

const mockProduct = (id = 1): Product =>
  ({
    id,
    name: `Producto ${id}`,
    slug: `producto-${id}`,
    price: 45000,
    compresion: false,
    design: { id: 1, name: 'Test', slug: 'test' },
    type: { id: 1, name: 'Test', slug: 'test' },
    subcategory: { id: 1, name: 'Test', slug: 'test' },
    images: [],
    sizes: [],
    colors: [],
    tags: [],
  }) as Product

describe('wishlistStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia vacío', () => {
    const wl = useWishlistStore()
    expect(wl.items).toHaveLength(0)
    expect(wl.itemCount).toBe(0)
  })

  it('agrega producto a favoritos', () => {
    const wl = useWishlistStore()
    wl.addItem(mockProduct())
    expect(wl.items).toHaveLength(1)
    expect(wl.isInWishlist(1)).toBe(true)
  })

  it('no agrega el mismo producto dos veces', () => {
    const wl = useWishlistStore()
    wl.addItem(mockProduct())
    wl.addItem(mockProduct())
    expect(wl.items).toHaveLength(1)
  })

  it('elimina producto de favoritos', () => {
    const wl = useWishlistStore()
    wl.addItem(mockProduct())
    wl.removeItem(1)
    expect(wl.items).toHaveLength(0)
    expect(wl.isInWishlist(1)).toBe(false)
  })

  it('toggleItem agrega si no está y elimina si está', () => {
    const wl = useWishlistStore()
    const p = mockProduct()
    wl.toggleItem(p)
    expect(wl.isInWishlist(1)).toBe(true)
    wl.toggleItem(p)
    expect(wl.isInWishlist(1)).toBe(false)
  })

  it('comparte la wishlist y devuelve token', async () => {
    const wl = useWishlistStore()
    wl.addItem(mockProduct())
    const token = await wl.share()
    expect(token).toBe('abc-123')
    expect(wl.token).toBe('abc-123')
  })

  it('limpia la wishlist', () => {
    const wl = useWishlistStore()
    wl.addItem(mockProduct(1))
    wl.addItem(mockProduct(2))
    wl.clearWishlist()
    expect(wl.items).toHaveLength(0)
  })
})
