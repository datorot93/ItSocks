import apiClient from './client'
import type { Order } from '@/types'

export interface CreateOrderPayload {
  customer_name: string
  email: string
  phone: string
  document?: string
  department?: string
  city?: string
  address: string
  billing_address?: string
  is_gift: boolean
  gift_from?: string
  gift_to?: string
  discount_code?: string
  shipping_id?: number
  items: Array<{
    product_id: number
    size_id: number
    quantity: number
    price: number
    pack_id?: number
  }>
}

export const orderApi = {
  createOrder(payload: CreateOrderPayload) {
    return apiClient.post<{ order: Order; preference_id: string }>('/orders', payload)
  },

  getOrder(id: number | string) {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  getOrderByPaymentId(paymentId: string) {
    return apiClient.get<Order>(`/orders/payment/${paymentId}`)
  },
}
