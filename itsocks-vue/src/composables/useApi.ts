import { ref } from 'vue'
import apiClient from '@/api/client'

export function useApi() {
  return { api: apiClient }
}

export function useFetch<T>(url: string, params?: Record<string, unknown>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<T>(url, { params })
      data.value = response.data
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err?.response?.data?.message ?? 'Error al cargar datos'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetch }
}
