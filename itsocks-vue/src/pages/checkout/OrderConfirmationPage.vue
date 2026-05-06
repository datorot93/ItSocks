<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { usePreferenceStore } from '@/stores/preferenceStore'
import { orderApi } from '@/api/orderApi'
import { formatCurrency } from '@/utils/formatters'
import Spinner from '@/components/ui/Spinner.vue'
import type { Order } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const preferenceStore = usePreferenceStore()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  try {
    const response = await orderApi.getOrder(id)
    order.value = response.data
    // Clear cart after successful order
    cartStore.clearCart()
    preferenceStore.clearPreference()
  } catch {
    error.value = 'No se encontró la orden'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <Spinner size="lg" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <RouterLink to="/" class="btn-primary px-6 py-2">Ir al inicio</RouterLink>
    </div>

    <!-- Order confirmation -->
    <div v-else-if="order" class="text-center">
      <div class="text-6xl mb-4">✅</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">¡Gracias por tu compra!</h1>
      <p class="text-gray-600 mb-6">
        Tu pedido #{{ order.id }} ha sido recibido. Te enviaremos un correo de confirmación a
        <strong>{{ order.email }}</strong>
      </p>

      <!-- Order summary -->
      <div class="bg-gray-50 rounded-xl p-6 text-left mb-6">
        <h2 class="font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-3"
          >
            <img
              :src="item.product.images?.[0]?.url ?? 'https://via.placeholder.com/60'"
              :alt="item.product.name"
              class="w-12 h-12 rounded object-cover"
            />
            <div class="flex-1">
              <p class="text-sm font-medium">{{ item.product.name }}</p>
              <p class="text-xs text-gray-500">{{ item.size.name }} × {{ item.quantity }}</p>
            </div>
            <p class="text-sm font-medium">{{ formatCurrency(item.price * item.quantity) }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{{ formatCurrency(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Envío</span>
            <span>{{ formatCurrency(order.shipping_cost) }}</span>
          </div>
          <div v-if="order.discount_amount > 0" class="flex justify-between text-green-700">
            <span>Descuento</span>
            <span>-{{ formatCurrency(order.discount_amount) }}</span>
          </div>
          <div class="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>{{ formatCurrency(order.total) }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-4 justify-center">
        <RouterLink to="/" class="btn-primary px-6 py-2">
          Seguir comprando
        </RouterLink>
        <RouterLink to="/medias/estampadas" class="btn-secondary px-6 py-2">
          Ver más productos
        </RouterLink>
      </div>
    </div>
  </div>
</template>
