<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PackCard from '@/components/pack/PackCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { packApi } from '@/api/packApi'
import type { Pack } from '@/types'

const packs = ref<Pack[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await packApi.getPacks()
    packs.value = response.data
  } catch {
    error.value = 'No se pudieron cargar los packs'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Packs</h1>
    <p class="text-gray-500 text-sm mb-6">Arma tu combinación favorita y ahorra</p>

    <div v-if="error" class="text-center py-12 text-red-600">{{ error }}</div>

    <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <SkeletonLoader v-for="n in 6" :key="n" type="card" />
    </div>

    <div v-else-if="packs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <PackCard v-for="pack in packs" :key="pack.id" :pack="pack" />
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      No hay packs disponibles por el momento
    </div>
  </div>
</template>
