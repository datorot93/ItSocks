<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Image } from '@/types'

const props = defineProps<{
  images: Image[]
  productName: string
}>()

const currentIndex = ref(0)

const currentImage = computed(() =>
  props.images?.[currentIndex.value]?.url ?? 'https://via.placeholder.com/600x600?text=ItSocks',
)

function selectImage(i: number) {
  currentIndex.value = i
}
</script>

<template>
  <div>
    <!-- Main image -->
    <div class="bg-gray-50 rounded-xl overflow-hidden mb-3">
      <img
        :src="currentImage"
        :alt="productName"
        data-testid="product-image"
        class="w-full object-cover h-80 md:h-96"
        loading="lazy"
      />
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in images"
        :key="img.id"
        @click="selectImage(i)"
        :class="[
          'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
          i === currentIndex ? 'border-brand-accent' : 'border-transparent hover:border-gray-300',
        ]"
      >
        <img :src="img.url" :alt="`${productName} ${i + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>
