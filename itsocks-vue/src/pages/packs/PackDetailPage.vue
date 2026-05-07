<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { usePackStore } from '@/stores/packStore'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { packApi } from '@/api/packApi'
import { formatCurrency } from '@/utils/formatters'
import type { Pack, Size } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const packStore = usePackStore()

const pack = ref<Pack | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const addedToCart = ref(false)

// Size selections per product in the pack
const selectedSizes = ref<Record<number, Size>>({})

const allSizesSelected = computed(() => {
  if (!pack.value) return false
  const products = pack.value.products ?? []
  if (products.length === 0) return false
  return products.every((pp) => !!selectedSizes.value[pp.product.id])
})

onMounted(async () => {
  try {
    const response = await packApi.getPack(route.params.id as string)
    pack.value = response.data
    packStore.setSelectedPack(response.data)
  } catch {
    error.value = 'Pack no encontrado'
  } finally {
    loading.value = false
  }
})

function selectSize(productId: number, size: Size) {
  selectedSizes.value[productId] = size
}

function addPackToCart() {
  if (!pack.value || !allSizesSelected.value) return
  const products = pack.value.products ?? []
  products.forEach((pp) => {
    const size = selectedSizes.value[pp.product.id]
    if (size) {
      cartStore.addItem(pp.product, size, pp.quantity, pack.value!.id)
    }
  })
  addedToCart.value = true
  setTimeout(() => { addedToCart.value = false }, 2000)
}

const mainImage = computed(() =>
  pack.value?.images?.[0]?.url ?? 'https://via.placeholder.com/600x400?text=Pack',
)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div v-if="loading">
      <SkeletonLoader type="card" />
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="router.push('/packs')" class="btn-secondary px-6 py-2">Ver packs</button>
    </div>

    <div v-else-if="pack" data-testid="pack-detail">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image -->
        <div>
          <img
            :src="mainImage"
            :alt="pack.name"
            class="w-full rounded-xl object-cover h-72 md:h-96"
          />
        </div>

        <!-- Info -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ pack.name }}</h1>
          <p v-if="pack.description" class="text-gray-600 text-sm mb-4">{{ pack.description }}</p>

          <p data-testid="pack-price" class="text-2xl font-bold text-brand-accent mb-6">
            {{ formatCurrency(pack.price) }}
            <span v-if="pack.discount_percentage" class="ml-2 text-sm bg-brand-accent text-white px-2 py-0.5 rounded-full">
              -{{ pack.discount_percentage }}%
            </span>
          </p>

          <!-- Products in pack -->
          <div v-if="pack.products && pack.products.length" class="space-y-4 mb-6">
            <div
              v-for="pp in pack.products"
              :key="pp.product.id"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="flex items-center gap-3 mb-2">
                <img
                  :src="pp.product.images?.[0]?.url ?? 'https://via.placeholder.com/60'"
                  :alt="pp.product.name"
                  class="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ pp.product.name }}</p>
                  <p class="text-xs text-gray-500">x{{ pp.quantity }}</p>
                </div>
              </div>
              <!-- Size selector for each product -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in pp.product.sizes"
                  :key="size.id"
                  @click="selectSize(pp.product.id, size)"
                  :class="[
                    'px-3 py-1 text-xs border rounded-md transition-colors',
                    selectedSizes[pp.product.id]?.id === size.id
                      ? 'border-brand-accent bg-brand-accent text-white'
                      : 'border-gray-300 text-gray-700 hover:border-brand-accent',
                  ]"
                >
                  {{ size.name }}
                </button>
              </div>
            </div>
          </div>

          <button
            @click="addPackToCart"
            :disabled="!allSizesSelected"
            data-testid="add-pack-to-cart-btn"
            :class="[
              'w-full py-3 rounded-lg font-semibold transition-colors',
              allSizesSelected
                ? addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-brand-accent text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ]"
          >
            {{ addedToCart ? 'Agregado!' : !allSizesSelected ? 'Selecciona todas las tallas' : 'Agregar pack al carrito' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
