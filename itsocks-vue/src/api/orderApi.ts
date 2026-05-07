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
  async createOrder(payload: CreateOrderPayload) {
    const laravelPayload = {
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      document: payload.document,
      shipping_city: payload.city,
      shipping_department: payload.department,
      shipping_address: payload.address,
      billing_address: payload.billing_address ?? payload.address,
      is_gift: payload.is_gift,
      gift_from: payload.gift_from,
      gift_to: payload.gift_to,
      items: payload.items.map((it) => ({
        product_id: it.product_id,
        quantity: it.quantity,
        size: String(it.size_id),
        pack: it.pack_id ? String(it.pack_id) : undefined,
      })),
    }
    const orderResp = await apiClient.post<Order>('/orders', laravelPayload)
    const order = orderResp.data
    const mpItems = payload.items.map((it) => ({
      title: `Producto ${it.product_id}`,
      quantity: it.quantity,
      unit_price: it.price,
      currency_id: 'COP',
    }))
    const prefResp = await apiClient.post<{ preference_id: string; id: string }>(
      '/payments/preference',
      { order_id: order.id, items: mpItems },
    )
    return { data: { order, preference_id: prefResp.data.preference_id } }
  },

  getOrder(id: number | string) {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  getOrderByPaymentId(paymentId: string) {
    return apiClient.get<Order>(`/orders/payment/${paymentId}`)
  },
}
