import apiClient from './client'
import type { ShippingCity, ShippingDepartment } from '@/types'

export const shippingApi = {
  getDepartments() {
    return apiClient.get<ShippingDepartment[]>('/shippings/departments')
  },

  getCitiesByDepartment(department: string) {
    return apiClient.get<ShippingCity[]>('/shippings/cities', {
      params: { department },
    })
  },

  getShippingRate(cityId: number) {
    return apiClient.get<{ rate: number; estimated_days: number }>(`/shippings/rate/${cityId}`)
  },

  getAllCities() {
    return apiClient.get<ShippingCity[]>('/shippings')
  },
}
