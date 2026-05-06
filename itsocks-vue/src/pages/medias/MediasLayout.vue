<script setup lang="ts">
import { RouterView } from 'vue-router'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
</script>

<template>
  <div>
    <Breadcrumb />
    <RouterView />
  </div>
</template>
