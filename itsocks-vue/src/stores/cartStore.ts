import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product, Size } from '@/types'

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])

    const total = computed(() =>
      items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
    )

    const subtotal = computed(() => total.value)

    const itemCount = computed(() =>
      items.value.reduce((acc, item) => acc + item.quantity, 0),
    )

    function addItem(product: Product, size: Size, quantity: number, packId?: number) {
      const existing = items.value.find(
        (i) => i.product.id === product.id && i.size.id === size.id,
      )
      if (existing) {
        existing.quantity += quantity
      } else {
        items.value.push({
          product,
          size,
          quantity,
          pack_id: packId,
          price: product.price,
        })
      }
    }

    function addOneToItem(productId: number, sizeId: number) {
      const item = items.value.find(
        (i) => i.product.id === productId && i.size.id === sizeId,
      )
      if (item) item.quantity += 1
    }

    function subtractOneFromItem(productId: number, sizeId: number) {
      const item = items.value.find(
        (i) => i.product.id === productId && i.size.id === sizeId,
      )
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          removeItem(productId, sizeId)
        }
      }
    }

    function removeItem(productId: number, sizeId: number) {
      items.value = items.value.filter(
        (i) => !(i.product.id === productId && i.size.id === sizeId),
      )
    }

    function clearCart() {
      items.value = []
    }

    function modifyItem(productId: number, sizeId: number, quantity: number) {
      const item = items.value.find(
        (i) => i.product.id === productId && i.size.id === sizeId,
      )
      if (item) {
        item.quantity = quantity
      }
    }

    return {
      items,
      total,
      subtotal,
      itemCount,
      addItem,
      addOneToItem,
      subtractOneFromItem,
      removeItem,
      clearCart,
      modifyItem,
    }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
