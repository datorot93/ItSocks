<script setup lang="ts">
import { ref } from 'vue'

interface FilterOption {
  label: string
  value: string
}

defineProps<{
  title?: string
  options: FilterOption[]
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <h3 v-if="title" class="font-semibold text-gray-900 mb-3 text-sm">{{ title }}</h3>
    <div class="space-y-2">
      <label
        v-for="opt in options"
        :key="opt.value"
        class="flex items-center gap-2 cursor-pointer group"
      >
        <input
          type="radio"
          :value="opt.value"
          :checked="modelValue === opt.value"
          @change="emit('update:modelValue', opt.value)"
          class="w-4 h-4 text-brand-accent focus:ring-brand-accent border-gray-300"
        />
        <span class="text-sm text-gray-700 group-hover:text-brand-accent transition-colors">
          {{ opt.label }}
        </span>
      </label>
    </div>
  </div>
</template>
