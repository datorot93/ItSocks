<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { productApi } from '@/api/productApi'
import type { Product } from '@/types'

const route = useRoute()
const subcategoria = computed(() => route.params.subcategoria as string)

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const hasMore = ref(false)

async function loadProducts(page = 1) {
  loading.value = true
  error.value = null
  try {
    const response = await productApi.getProducts({
      subcategory: subcategoria.value,
      page,
      per_page: 20,
    })
    const data = response.data
    if (page === 1) {
      products.value = Array.isArray(data) ? data : (data.data ?? [])
    } else {
      const newItems = Array.isArray(data) ? data : (data.data ?? [])
      products.value.push(...newItems)
    }
    if (!Array.isArray(data)) {
      hasMore.value = data.current_page < data.last_page
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
watch(subcategoria, () => {
  currentPage.value = 1
  loadProducts(1)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2 capitalize">
      Medias {{ subcategoria }}
    </h1>
    <p class="text-gray-500 text-sm mb-6">
      {{ products.length }} producto{{ products.length !== 1 ? 's' : '' }} encontrado{{ products.length !== 1 ? 's' : '' }}
    </p>

    <!-- Error -->
    <div v-if="error" class="text-center py-12 text-red-600">{{ error }}</div>

    <!-- Skeleton -->
    <div v-else-if="loading && products.length === 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SkeletonLoader v-for="n in 12" :key="n" type="card" />
    </div>

    <!-- Grid -->
    <div v-else-if="products.length > 0">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
      <div v-if="hasMore" class="text-center mt-8">
        <button
          @click="loadMore"
          :disabled="loading"
          class="btn-secondary px-6 py-2"
        >
          {{ loading ? 'Cargando...' : 'Cargar más' }}
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 mb-4">No hay productos en esta categoría</p>
      <RouterLink to="/" class="btn-primary px-6 py-2">Ir al inicio</RouterLink>
    </div>
  </div>
</template>
