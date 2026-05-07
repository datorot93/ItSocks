<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const router = useRouter()

const searchQuery = ref('')
const mobileMenuOpen = ref(false)

const cartCount = computed(() => cartStore.itemCount)
const wishCount = computed(() => wishlistStore.itemCount)

function submitSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
    mobileMenuOpen.value = false
  }
}

const categories = [
  { label: 'Estampadas', to: '/medias/estampadas' },
  { label: 'Lisas', to: '/medias/lisas' },
  { label: 'Pantorrilleras', to: '/medias/pantorrilleras' },
  { label: 'Tejidas', to: '/medias/tejidas' },
  { label: 'Packs', to: '/packs' },
]
</script>

<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex-shrink-0 font-bold text-xl text-brand-DEFAULT tracking-tight">
          ItSocks
        </RouterLink>

        <!-- Desktop navigation -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink
            v-for="cat in categories"
            :key="cat.to"
            :to="cat.to"
            class="text-sm font-medium text-gray-700 hover:text-brand-accent transition-colors"
          >
            {{ cat.label }}
          </RouterLink>
        </div>

        <!-- Search + icons -->
        <div class="flex items-center gap-3">
          <!-- Search form -->
          <form @submit.prevent="submitSearch" class="hidden sm:flex items-center">
            <input
              v-model="searchQuery"
              data-testid="nav-search-input"
              type="text"
              placeholder="Buscar..."
              class="border border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent w-40"
            />
            <button
              type="submit"
              class="border border-l-0 border-gray-300 rounded-r-md px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <!-- Wishlist icon -->
          <RouterLink to="/lista_de_favoritos" class="relative p-2 text-gray-600 hover:text-brand-accent transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span
              v-if="wishCount > 0"
              class="absolute -top-1 -right-1 bg-brand-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ wishCount }}
            </span>
          </RouterLink>

          <!-- Cart icon -->
          <RouterLink to="/carrito" class="relative p-2 text-gray-600 hover:text-brand-accent transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span
              v-if="cartCount > 0"
              data-testid="cart-count"
              class="absolute -top-1 -right-1 bg-brand-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </RouterLink>

          <!-- Mobile menu toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-brand-accent"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-4 py-3 space-y-2">
        <form @submit.prevent="submitSearch" class="flex items-center mb-3">
          <input
            v-model="searchQuery"
            data-testid="search-input-mobile"
            type="text"
            placeholder="Buscar..."
            class="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none"
          />
          <button type="submit" class="border border-l-0 border-gray-300 rounded-r-md px-3 py-2 bg-gray-50">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        <RouterLink
          v-for="cat in categories"
          :key="cat.to"
          :to="cat.to"
          @click="mobileMenuOpen = false"
          class="block py-2 text-sm font-medium text-gray-700 hover:text-brand-accent"
        >
          {{ cat.label }}
        </RouterLink>
        <RouterLink to="/guia-de-tallas" @click="mobileMenuOpen = false" class="block py-2 text-sm text-gray-600">
          Guía de Tallas
        </RouterLink>
        <RouterLink to="/envios" @click="mobileMenuOpen = false" class="block py-2 text-sm text-gray-600">
          Envíos
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
