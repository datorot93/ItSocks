<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

interface Crumb {
  label: string
  to?: string
}

const crumbs = computed<Crumb[]>(() => {
  const parts: Crumb[] = [{ label: 'Inicio', to: '/' }]
  const params = route.params

  if (params.subcategoria) {
    parts.push({
      label: String(params.subcategoria).charAt(0).toUpperCase() + String(params.subcategoria).slice(1),
      to: `/medias/${params.subcategoria}`,
    })
  }
  if (params.tipo) {
    parts.push({
      label: String(params.tipo).charAt(0).toUpperCase() + String(params.tipo).slice(1),
      to: `/medias/${params.subcategoria}/${params.tipo}`,
    })
  }
  if (params.disenio) {
    parts.push({
      label: String(params.disenio).charAt(0).toUpperCase() + String(params.disenio).slice(1),
    })
  }

  return parts
})
</script>

<template>
  <nav v-if="crumbs.length > 1" class="bg-gray-50 border-b border-gray-200 px-4 py-2">
    <div class="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
      <template v-for="(crumb, i) in crumbs" :key="i">
        <RouterLink v-if="crumb.to && i < crumbs.length - 1" :to="crumb.to" class="hover:text-brand-accent transition-colors">
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="text-gray-700 font-medium">{{ crumb.label }}</span>
        <span v-if="i < crumbs.length - 1" class="text-gray-400">/</span>
      </template>
    </div>
  </nav>
</template>
