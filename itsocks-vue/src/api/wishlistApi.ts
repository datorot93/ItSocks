import apiClient from './client'
import type { WishlistItem } from '@/types'

export const wishlistApi = {
  getWishlist(token: string) {
    return apiClient.get<{ items: WishlistItem[]; token: string }>(`/wishlists/${token}`)
  },

  createWishlist(productIds: number[]) {
    return apiClient.post<{ token: string; items: WishlistItem[] }>('/wishlists', {
      product_ids: productIds,
    })
  },
}
