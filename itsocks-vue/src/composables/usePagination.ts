import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, perPage = 20) {
  const currentPage = ref(initialPage)
  const totalPages = ref(0)
  const total = ref(0)

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  function nextPage() {
    if (hasNextPage.value) currentPage.value++
  }

  function prevPage() {
    if (hasPrevPage.value) currentPage.value--
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function setMeta(meta: { last_page: number; total: number }) {
    totalPages.value = meta.last_page
    total.value = meta.total
  }

  return {
    currentPage,
    totalPages,
    total,
    perPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    setMeta,
  }
}
