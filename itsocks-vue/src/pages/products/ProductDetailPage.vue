<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGallery from '@/components/product/ProductGallery.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { productApi } from '@/api/productApi'
import { formatCurrency } from '@/utils/formatters'
import type { Product, Size } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedSize = ref<Size | null>(null)
const quantity = ref(1)
const addedToCart = ref(false)

const productSlug = computed(() => route.params.nombre as string)
const isInWishlist = computed(() => product.value ? wishlistStore.isInWishlist(product.value.id) : false)

async function loadProduct() {
  loading.value = true
  error.value = null
  selectedSize.value = null
  try {
    const response = await productApi.getProductBySlug(productSlug.value)
    product.value = response.data
  } catch {
    error.value = 'Producto no encontrado'
  } finally {
    loading.value = false
  }
}

function selectSize(size: Size) {
  selectedSize.value = size
}

function addToCart() {
  if (!product.value || !selectedSize.value) return
  cartStore.addItem(product.value, selectedSize.value, quantity.value)
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 2000)
}

function toggleWishlist() {
  if (product.value) wishlistStore.toggleItem(product.value)
}

onMounted(loadProduct)
watch(productSlug, loadProduct)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <SkeletonLoader type="card" />
      <div class="space-y-4">
        <SkeletonLoader type="line" :count="6" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="router.back()" class="btn-secondary px-6 py-2">Volver</button>
    </div>

    <!-- Product detail -->
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Gallery -->
      <ProductGallery :images="product.images" :product-name="product.name" />

      <!-- Info -->
      <div>
        <h1 data-testid="product-name" class="text-2xl font-bold text-gray-900 mb-2">
          {{ product.name }}
        </h1>
        <p data-testid="product-price" class="text-2xl font-bold text-brand-accent mb-4">
          {{ formatCurrency(product.price) }}
        </p>

        <div v-if="product.compresion" class="mb-4">
          <span class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Compresión</span>
        </div>

        <div v-if="product.description" class="text-gray-600 text-sm mb-6 leading-relaxed">
          {{ product.description }}
        </div>

        <!-- Size selector -->
        <div class="mb-6" data-testid="size-selector">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-gray-900 text-sm">Talla</h3>
            <RouterLink to="/guia-de-tallas" class="text-xs text-brand-accent hover:underline">
              Guía de tallas
            </RouterLink>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in product.sizes"
              :key="size.id"
              @click="selectSize(size)"
              :class="[
                'px-4 py-2 border rounded-md text-sm font-medium transition-colors',
                selectedSize?.id === size.id
                  ? 'border-brand-accent bg-brand-accent text-white'
                  : 'border-gray-300 text-gray-700 hover:border-brand-accent',
              ]"
            >
              {{ size.name }}
            </button>
          </div>
          <p v-if="!selectedSize" class="text-xs text-red-500 mt-1">Selecciona una talla</p>
        </div>

        <!-- Quantity -->
        <div class="flex items-center gap-3 mb-6">
          <span class="text-sm font-medium text-gray-700">Cantidad:</span>
          <div class="flex items-center border border-gray-300 rounded-md">
            <button
              @click="quantity = Math.max(1, quantity - 1)"
              class="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span class="px-4 py-2 text-sm font-medium">{{ quantity }}</span>
            <button
              @click="quantity++"
              class="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mb-6">
          <button
            @click="addToCart"
            :disabled="!selectedSize"
            data-testid="add-to-cart-btn"
            :class="[
              'flex-1 py-3 rounded-lg font-semibold transition-all',
              selectedSize
                ? addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-brand-accent text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ]"
          >
            {{ addedToCart ? 'Agregado al carrito!' : 'Agregar al carrito' }}
          </button>
          <button
            @click="toggleWishlist"
            :class="[
              'px-4 py-3 border rounded-lg transition-colors',
              isInWishlist
                ? 'border-brand-accent bg-red-50 text-brand-accent'
                : 'border-gray-300 text-gray-600 hover:border-brand-accent',
            ]"
            :aria-label="isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            <svg class="w-5 h-5" :class="isInWishlist ? 'fill-brand-accent' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <!-- Tags -->
        <div v-if="product.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in product.tags"
            :key="tag.id"
            class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
