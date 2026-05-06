<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const isEmpty = computed(() => cartStore.itemCount === 0)

function goToCheckout() {
  router.push('/checkout')
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Carrito de Compras</h1>

    <!-- Empty cart -->
    <div v-if="isEmpty" class="text-center py-16" data-testid="cart-empty">
      <div class="text-6xl mb-4">🛒</div>
      <p class="text-gray-500 text-lg mb-6">Tu carrito está vacío</p>
      <RouterLink to="/" class="btn-primary px-6 py-3">Seguir comprando</RouterLink>
    </div>

    <!-- Cart with items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Items list -->
      <div class="lg:col-span-2">
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <CartItem
            v-for="item in cartStore.items"
            :key="`${item.product.id}-${item.size.id}`"
            :item="item"
          />
        </div>
        <div class="mt-4 flex justify-between items-center">
          <RouterLink to="/" class="text-sm text-brand-accent hover:underline">
            Seguir comprando
          </RouterLink>
          <button
            @click="cartStore.clearCart()"
            class="text-sm text-red-500 hover:underline"
          >
            Vaciar carrito
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div>
        <CartSummary />
        <button
          @click="goToCheckout"
          class="w-full mt-4 bg-brand-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Continuar con el pago
        </button>
      </div>
    </div>
  </div>
</template>
