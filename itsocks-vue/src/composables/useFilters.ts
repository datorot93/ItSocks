import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProductFilters } from '@/types'

export function useFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = ref<ProductFilters>({
    subcategory: (route.params.subcategoria as string) || undefined,
    type: (route.params.tipo as string) || undefined,
    design: (route.params.disenio as string) || undefined,
    page: 1,
    per_page: 20,
  })

  const hasActiveFilters = computed(
    () => !!(filters.value.type || filters.value.design || filters.value.compresion !== undefined),
  )

  function setFilter(key: keyof ProductFilters, value: unknown) {
    ;(filters.value as Record<string, unknown>)[key] = value
    filters.value.page = 1
  }

  function clearFilters() {
    filters.value = {
      subcategory: filters.value.subcategory,
      page: 1,
      per_page: 20,
    }
  }

  function nextPage() {
    filters.value.page = (filters.value.page ?? 1) + 1
  }

  // Sync from route params
  watch(
    () => route.params,
    (params) => {
      if (params.subcategoria) filters.value.subcategory = params.subcategoria as string
      if (params.tipo) filters.value.type = params.tipo as string
      if (params.disenio) filters.value.design = params.disenio as string
    },
    { immediate: true },
  )

  return { filters, hasActiveFilters, setFilter, clearFilters, nextPage, router }
}
