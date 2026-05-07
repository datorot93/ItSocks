<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { productApi } from '@/api/productApi'
import type { Product } from '@/types'

const route = useRoute()

const subcategoria = computed(() => route.params.subcategoria as string)
const tipo = computed(() => route.params.tipo as string | undefined)
const disenio = computed(() => route.params.disenio as string | undefined)
const compresion = computed(() => route.params.compresion as string | undefined)

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const hasMore = ref(false)
const total = ref(0)

// Filter sidebar state
const showFilters = ref(false)

async function loadProducts(page = 1) {
  loading.value = true
  error.value = null
  try {
    const response = await productApi.getProducts({
      subcategory: subcategoria.value,
      type: tipo.value,
      design: disenio.value,
      compresion: compresion.value === 'compresion' ? true : undefined,
      page,
      per_page: 20,
    })
    const data = response.data
    const items = Array.isArray(data) ? data : (data.data ?? [])
    if (page === 1) {
      products.value = items
      total.value = !Array.isArray(data) ? (data.meta?.total ?? data.total ?? items.length) : items.length
    } else {
      products.value.push(...items)
    }
    if (!Array.isArray(data)) {
      const currentPage = data.meta?.current_page ?? data.current_page
      const lastPage = data.meta?.last_page ?? data.last_page
      hasMore.value = currentPage != null && lastPage != null && currentPage < lastPage
    }
  } catch {
    error.value = 'No se pudieron cargar los productos'
  } finally {
    loading.value = false
  }
}

function loadMore() {
  currentPage.value++
  loadProducts(currentPage.value)
}

onMounted(() => loadProducts(1))

watch([subcategoria, tipo, disenio, compresion], () => {
  currentPage.value = 1
  loadProducts(1)
})

const pageTitle = computed(() => {
  const parts = []
  if (subcategoria.value) parts.push(subcategoria.value)
  if (tipo.value) parts.push(tipo.value)
  if (disenio.value) parts.push(disenio.value)
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' - ')
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ total }} productos</p>
      </div>
      <button
        @click="showFilters = !showFilters"
        class="md:hidden flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        Filtros
      </button>
    </div>

    <div class="flex gap-6">
      <!-- Filters sidebar -->
      <aside :class="['w-56 flex-shrink-0', showFilters ? 'block' : 'hidden md:block']">
        <div class="bg-gray-50 rounded-xl p-4 space-y-4">
          <h3 class="font-semibold text-gray-900 text-sm">Filtros</h3>
          <div v-if="compresion !== undefined">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Tipo</p>
            <div class="space-y-1">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" class="rounded border-gray-300 text-brand-accent" checked />
                <span>Compresión</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Products grid -->
      <div class="flex-1">
        <div v-if="error" class="text-center py-12 text-red-600">{{ error }}</div>

        <div v-else-if="loading && products.length === 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <SkeletonLoader v-for="n in 12" :key="n" type="card" />
        </div>

        <div v-else-if="products.length > 0">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
          </div>
          <div v-if="hasMore" class="text-center mt-8">
            <button @click="loadMore" :disabled="loading" class="btn-secondary px-6 py-2">
              {{ loading ? 'Cargando...' : 'Ver más productos' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          No hay productos con estos filtros
        </div>
      </div>
    </div>
  </div>
</template>
