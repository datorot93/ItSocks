<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Pack } from '@/types'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  pack: Pack
}>()

const router = useRouter()

const mainImage = computed(() =>
  props.pack.images?.[0]?.url ?? 'https://via.placeholder.com/400x300?text=Pack',
)

function goToDetail() {
  router.push(`/packs/${props.pack.id}`)
}
</script>

<template>
  <div
    data-testid="pack-card"
    @click="goToDetail"
    class="card group cursor-pointer hover:shadow-md transition-shadow"
  >
    <!-- Image -->
    <div class="overflow-hidden bg-gray-50 h-52">
      <img
        :src="mainImage"
        :alt="pack.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 mb-1">{{ pack.name }}</h3>
      <p v-if="pack.description" class="text-sm text-gray-500 line-clamp-2 mb-2">
        {{ pack.description }}
      </p>
      <div class="flex items-center justify-between">
        <span class="text-brand-accent font-bold text-lg" data-testid="pack-price">
          {{ formatCurrency(pack.price) }}
        </span>
        <span v-if="pack.discount_percentage" class="text-xs bg-brand-accent text-white px-2 py-0.5 rounded-full">
          -{{ pack.discount_percentage }}%
        </span>
      </div>
    </div>
  </div>
</template>
