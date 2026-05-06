import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, WishlistItem } from '@/types'
import { wishlistApi } from '@/api/wishlistApi'

export const useWishlistStore = defineStore(
  'wishlist',
  () => {
    const items = ref<WishlistItem[]>([])
    const token = ref<string | null>(null)

    const itemCount = computed(() => items.value.length)

    function isInWishlist(productId: number) {
      return items.value.some((i) => i.product.id === productId)
    }

    function addItem(product: Product) {
      if (!isInWishlist(product.id)) {
        items.value.push({ product, addedAt: new Date().toISOString() })
      }
    }

    function removeItem(productId: number) {
      items.value = items.value.filter((i) => i.product.id !== productId)
    }

    function toggleItem(product: Product) {
      if (isInWishlist(product.id)) {
        removeItem(product.id)
      } else {
        addItem(product)
      }
    }

    function clearWishlist() {
      items.value = []
      token.value = null
    }

    async function share(): Promise<string> {
      const productIds = items.value.map((i) => i.product.id)
      const response = await wishlistApi.createWishlist(productIds)
      token.value = response.data.token
      return token.value
    }

    return {
      items,
      token,
      itemCount,
      isInWishlist,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
      share,
    }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
