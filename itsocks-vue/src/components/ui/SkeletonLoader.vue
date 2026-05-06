<script setup lang="ts">
defineProps<{
  count?: number
  type?: 'card' | 'line' | 'circle'
}>()
</script>

<template>
  <div class="animate-pulse">
    <!-- Card skeletons -->
    <template v-if="type === 'card'">
      <div v-for="n in (count ?? 1)" :key="n" class="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div class="bg-gray-200 h-48 w-full" />
        <div class="p-4 space-y-2">
          <div class="bg-gray-200 h-4 rounded w-3/4" />
          <div class="bg-gray-200 h-4 rounded w-1/2" />
          <div class="bg-gray-200 h-8 rounded w-full mt-2" />
        </div>
      </div>
    </template>
    <!-- Line skeletons -->
    <template v-else-if="type === 'line'">
      <div v-for="n in (count ?? 3)" :key="n" class="bg-gray-200 h-4 rounded mb-2 last:w-3/4" />
    </template>
    <!-- Circle skeleton -->
    <template v-else>
      <div class="bg-gray-200 rounded-full w-12 h-12" />
    </template>
  </div>
</template>
