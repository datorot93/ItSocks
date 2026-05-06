import apiClient from './client'
import type { Pack } from '@/types'

export const packApi = {
  getPacks() {
    return apiClient.get<Pack[]>('/packs')
  },

  getPack(id: number | string) {
    return apiClient.get<Pack>(`/packs/${id}`)
  },
}
