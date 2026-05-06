import apiClient from './client'
import type { User } from '@/types'

export const authApi = {
  login(email: string, password: string) {
    return apiClient.post<{ user: User; token: string }>('/auth/login', { email, password })
  },

  logout() {
    return apiClient.post('/auth/logout')
  },

  me() {
    return apiClient.get<User>('/auth/me')
  },
}
