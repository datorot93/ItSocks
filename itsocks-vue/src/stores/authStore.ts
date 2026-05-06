import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authApi } from '@/api/authApi'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value && !!user.value)

    async function login(email: string, password: string) {
      const response = await authApi.login(email, password)
      user.value = response.data.user
      token.value = response.data.token
    }

    async function logout() {
      try {
        await authApi.logout()
      } catch {
        // ignore
      } finally {
        user.value = null
        token.value = null
      }
    }

    function clearAuth() {
      user.value = null
      token.value = null
    }

    return { user, token, isAuthenticated, login, logout, clearAuth }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
