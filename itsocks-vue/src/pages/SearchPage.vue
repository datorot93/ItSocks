<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { productApi } from '@/api/productApi'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()

const query = ref((route.query.q as string) ?? '')
const results = ref<Product[]>([])
const loading = ref(false)
const searched = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function search(q: string) {
  if (!q.trim()) {
    results.value = []
    searched.value = false
    return
  }
  loading.value = true
  searched.value = true
  try {
    const response = await productApi.searchProducts(q)
    results.value = Array.isArray(response.data) ? response.data : []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    router.replace({ name: 'search', query: { q: query.value } })
    search(query.value)
  }, 300)
}

onMounted(() => {
  if (query.value) search(query.value)
})

watch(
  () => route.query.q,
  (q) => {
    query.value = (q as string) ?? ''
    if (query.value) search(query.value)
  },
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Buscar productos</h1>

    <!-- Search input -->
    <form @submit.prevent="search(query)" class="flex gap-2 mb-8 max-w-xl">
      <input
        v-model="query"
        data-testid="search-input"
        type="text"
        placeholder="Buscar medias, packs..."
        @input="onInput"
        class="flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
      />
      <button type="submit" class="btn-primary px-6 py-2 text-sm">Buscar</button>
    </form>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SkeletonLoader v-for="n in 8" :key="n" type="card" />
    </div>

    <!-- Results -->
    <div v-else-if="results.length > 0">
      <p class="text-sm text-gray-500 mb-4">{{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }} para "{{ query }}"</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="product in results"
          :key="product.id"
          data-testid="search-result"
        >
          <ProductCard :product="product" />
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="searched && !loading" class="text-center py-12 text-gray-500">
      <p class="text-lg mb-2">Sin resultados para "{{ query }}"</p>
      <p class="text-sm">Intenta con otras palabras clave</p>
    </div>
  </div>
</template>
