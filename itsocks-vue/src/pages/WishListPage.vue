<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { wishlistApi } from '@/api/wishlistApi'
import type { Product } from '@/types'

const route = useRoute()
const wishlistStore = useWishlistStore()

const token = computed(() => route.params.token as string | undefined)
const isSharedView = computed(() => !!token.value)

const sharedProducts = ref<Product[]>([])
const loading = ref(false)
const shareUrl = ref('')
const sharing = ref(false)
const copied = ref(false)

onMounted(async () => {
  if (isSharedView.value && token.value) {
    loading.value = true
    try {
      const response = await wishlistApi.getWishlist(token.value)
      sharedProducts.value = response.data.items.map((i) => i.product)
    } catch {
      // ignore
    } finally {
      loading.value = false
    }
  }
})

const displayedProducts = computed(() =>
  isSharedView.value
    ? sharedProducts.value
    : wishlistStore.items.map((i) => i.product),
)

async function shareWishlist() {
  if (wishlistStore.items.length === 0) return
  sharing.value = true
  try {
    const t = await wishlistStore.share()
    shareUrl.value = `${window.location.origin}/lista_de_favoritos/${t}`
  } catch {
    // fallback to current token
  } finally {
    sharing.value = false
  }
}

function copyUrl() {
  navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isSharedView ? 'Lista de Favoritos compartida' : 'Mis Favoritos' }}
      </h1>
      <button
        v-if="!isSharedView && wishlistStore.items.length > 0"
        @click="shareWishlist"
        :disabled="sharing"
        class="btn-secondary text-sm px-4 py-2"
      >
        {{ sharing ? 'Generando...' : 'Compartir lista' }}
      </button>
    </div>

    <!-- Share URL -->
    <div v-if="shareUrl" class="mb-6 flex gap-2 max-w-xl">
      <input
        :value="shareUrl"
        data-testid="share-url"
        readonly
        class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
      />
      <button @click="copyUrl" class="btn-primary text-sm px-4 py-2">
        {{ copied ? 'Copiado!' : 'Copiar' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <Spinner size="md" />
    </div>

    <!-- Products grid -->
    <div v-else-if="displayedProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="product in displayedProducts" :key="product.id" data-testid="wishlist-item">
        <ProductCard :product="product" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <div class="text-5xl mb-4">❤️</div>
      <p class="text-gray-500 mb-4">
        {{ isSharedView ? 'Esta lista está vacía' : 'Aún no tienes favoritos' }}
      </p>
      <RouterLink to="/medias/estampadas" class="btn-primary px-6 py-2">
        Explorar productos
      </RouterLink>
    </div>
  </div>
</template>
