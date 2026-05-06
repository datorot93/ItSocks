<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))
const wishlistToast = ref(false)

const mainImage = computed(() =>
  props.product.images?.[0]?.url ?? 'https://via.placeholder.com/400x400?text=ItSocks',
)

function goToDetail() {
  const p = props.product
  const sub = p.subcategory?.slug ?? 'estampadas'
  const tipo = p.type?.slug ?? 'todos'
  const disenio = p.design?.slug ?? p.slug

  router.push(`/medias/${sub}/${tipo}/${disenio}/${p.slug}`)
}

function toggleWishlist() {
  wishlistStore.toggleItem(props.product)
  wishlistToast.value = true
  setTimeout(() => {
    wishlistToast.value = false
  }, 2000)
}
</script>

<template>
  <div
    data-testid="product-card"
    class="card group cursor-pointer hover:shadow-md transition-shadow relative"
  >
    <!-- Wishlist button -->
    <button
      @click.stop="toggleWishlist"
      data-testid="wishlist-btn"
      class="absolute top-2 right-2 z-10 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
      :aria-label="isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    >
      <svg
        class="w-4 h-4 transition-colors"
        :class="isInWishlist ? 'text-brand-accent fill-brand-accent' : 'text-gray-400'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>

    <!-- Wishlist toast -->
    <div
      v-if="wishlistToast"
      data-testid="wishlist-toast"
      class="absolute top-2 left-2 z-10 bg-brand-DEFAULT text-white text-xs px-2 py-1 rounded-md"
    >
      {{ isInWishlist ? 'Agregado a favoritos' : 'Quitado de favoritos' }}
    </div>

    <!-- Image -->
    <div @click="goToDetail" class="overflow-hidden bg-gray-50 h-52">
      <img
        :src="mainImage"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    <!-- Info -->
    <div @click="goToDetail" class="p-4">
      <h3 class="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{{ product.name }}</h3>
      <p class="text-brand-accent font-semibold text-base">
        {{ formatCurrency(product.price) }}
      </p>
      <div v-if="product.compresion" class="mt-1">
        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Compresión</span>
      </div>
    </div>
  </div>
</template>
