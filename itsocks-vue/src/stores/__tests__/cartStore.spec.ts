import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import { useCartStore } from '../cartStore'
import type { Product, Size } from '@/types'

const mockProduct = (id = 1, price = 45000): Product =>
  ({
    id,
    name: `Media Test ${id}`,
    slug: `media-test-${id}`,
    price,
    compresion: false,
    design: { id: 1, name: 'Estampado', slug: 'estampado' },
    type: { id: 1, name: 'Largas', slug: 'largas' },
    subcategory: { id: 1, name: 'Estampadas', slug: 'estampadas' },
    images: [],
    sizes: [],
    colors: [],
    tags: [],
  }) as Product

const mockSize = (id = 1): Size => ({ id, name: `Talla ${id === 1 ? 'M' : 'L'}` })

describe('cartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia con carrito vacío', () => {
    const cart = useCartStore()
    expect(cart.items).toHaveLength(0)
    expect(cart.total).toBe(0)
    expect(cart.itemCount).toBe(0)
  })

  it('agrega producto al carrito', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 2)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]!.quantity).toBe(2)
    expect(cart.total).toBe(90000)
  })

  it('incrementa cantidad si el mismo producto/talla ya existe', () => {
    const cart = useCartStore()
    const product = mockProduct()
    const size = mockSize()

    cart.addItem(product, size, 1)
    cart.addItem(product, size, 1)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]!.quantity).toBe(2)
  })

  it('trata el mismo producto con distintas tallas como items separados', () => {
    const cart = useCartStore()
    const product = mockProduct()

    cart.addItem(product, mockSize(1), 1)
    cart.addItem(product, mockSize(2), 1)

    expect(cart.items).toHaveLength(2)
  })

  it('elimina producto del carrito', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 1)
    cart.removeItem(1, 1)

    expect(cart.items).toHaveLength(0)
  })

  it('limpia el carrito', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(1), mockSize(1), 2)
    cart.addItem(mockProduct(2), mockSize(2), 1)
    cart.clearCart()

    expect(cart.items).toHaveLength(0)
    expect(cart.total).toBe(0)
  })

  it('calcula el total correctamente con múltiples items', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(1, 45000), mockSize(1), 2) // 90000
    cart.addItem(mockProduct(2, 30000), mockSize(2), 3) // 90000

    expect(cart.total).toBe(180000)
  })

  it('calcula itemCount correctamente', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(1), mockSize(1), 3)
    cart.addItem(mockProduct(2), mockSize(2), 2)

    expect(cart.itemCount).toBe(5)
  })

  it('incrementa cantidad de un item', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 1)
    cart.addOneToItem(1, 1)

    expect(cart.items[0]!.quantity).toBe(2)
  })

  it('decrementa cantidad de un item', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 3)
    cart.subtractOneFromItem(1, 1)

    expect(cart.items[0]!.quantity).toBe(2)
  })

  it('elimina el item cuando la cantidad llega a 0 al decrementar', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 1)
    cart.subtractOneFromItem(1, 1)

    expect(cart.items).toHaveLength(0)
  })

  it('modifica cantidad directamente', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 1)
    cart.modifyItem(1, 1, 5)

    expect(cart.items[0]!.quantity).toBe(5)
  })

  it('guarda pack_id cuando se agrega desde un pack', () => {
    const cart = useCartStore()
    cart.addItem(mockProduct(), mockSize(), 1, 99)

    expect(cart.items[0]!.pack_id).toBe(99)
  })
})
