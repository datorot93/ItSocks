<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { productApi } from '@/api/productApi'
import type { Product } from '@/types'

const modules = [Autoplay, Pagination, Navigation]

const featuredProducts = ref<Product[]>([])
const loadingProducts = ref(true)

const banners = [
  {
    id: 1,
    title: 'Medias Estampadas',
    subtitle: 'Diseños exclusivos para cada ocasión',
    cta: 'Ver colección',
    to: '/medias/estampadas',
    bg: 'from-brand-DEFAULT to-brand-dark',
  },
  {
    id: 2,
    title: 'Packs Especiales',
    subtitle: 'Arma tu pack favorito y ahorra',
    cta: 'Ver packs',
    to: '/packs',
    bg: 'from-brand-dark to-brand-light',
  },
  {
    id: 3,
    title: 'Medias de Compresión',
    subtitle: 'Para running y deporte de alto rendimiento',
    cta: 'Descubrir',
    to: '/medias/pantorrilleras',
    bg: 'from-gray-800 to-gray-900',
  },
]

const categories = [
  { label: 'Estampadas', to: '/medias/estampadas', icon: '🎨' },
  { label: 'Lisas', to: '/medias/lisas', icon: '✨' },
  { label: 'Pantorrilleras', to: '/medias/pantorrilleras', icon: '🦵' },
  { label: 'Tejidas', to: '/medias/tejidas', icon: '🧶' },
  { label: 'Packs', to: '/packs', icon: '📦' },
]

onMounted(async () => {
  try {
    const response = await productApi.getProducts({ per_page: 8 })
    featuredProducts.value = response.data.data ?? response.data as unknown as Product[]
  } catch {
    // silently fail — show empty state
  } finally {
    loadingProducts.value = false
  }
})
</script>

<template>
  <div>
    <!-- Hero Carousel -->
    <section class="relative">
      <Swiper
        :modules="modules"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        :navigation="true"
        :loop="true"
        class="w-full h-72 md:h-96"
      >
        <SwiperSlide v-for="banner in banners" :key="banner.id">
          <div :class="`bg-gradient-to-r ${banner.bg} flex items-center justify-center h-full`">
            <div class="text-center text-white px-6">
              <h1 class="text-3xl md:text-5xl font-bold mb-3">{{ banner.title }}</h1>
              <p class="text-lg md:text-xl opacity-90 mb-6">{{ banner.subtitle }}</p>
              <RouterLink
                :to="banner.to"
                class="inline-block bg-white text-brand-DEFAULT font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-opacity"
              >
                {{ banner.cta }}
              </RouterLink>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- Categories quick nav -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex gap-4 overflow-x-auto pb-2">
        <RouterLink
          v-for="cat in categories"
          :key="cat.to"
          :to="cat.to"
          class="flex-shrink-0 flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-brand-accent hover:shadow-sm transition-all group"
        >
          <span class="text-2xl">{{ cat.icon }}</span>
          <span class="text-sm font-medium text-gray-700 group-hover:text-brand-accent transition-colors">
            {{ cat.label }}
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- Featured products -->
    <section class="max-w-7xl mx-auto px-4 pb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Productos Destacados</h2>
        <RouterLink to="/medias/estampadas" class="text-sm text-brand-accent font-medium hover:underline">
          Ver todos
        </RouterLink>
      </div>

      <!-- Skeleton while loading -->
      <div v-if="loadingProducts" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SkeletonLoader v-for="n in 8" :key="n" type="card" />
      </div>

      <!-- Products grid -->
      <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12 text-gray-500">
        <p>Cargando productos...</p>
      </div>
    </section>

    <!-- Info strip -->
    <section class="bg-brand-DEFAULT text-white py-8">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-3xl mb-2">🚚</div>
          <h3 class="font-semibold mb-1">Envíos a todo Colombia</h3>
          <p class="text-gray-400 text-sm">Recibe tu pedido en 2-5 días hábiles</p>
        </div>
        <div>
          <div class="text-3xl mb-2">🔒</div>
          <h3 class="font-semibold mb-1">Pago Seguro</h3>
          <p class="text-gray-400 text-sm">Transacciones protegidas con MercadoPago</p>
        </div>
        <div>
          <div class="text-3xl mb-2">↩️</div>
          <h3 class="font-semibold mb-1">Cambios garantizados</h3>
          <p class="text-gray-400 text-sm">¿Problemas con tu talla? Te ayudamos</p>
        </div>
      </div>
    </section>
  </div>
</template>
