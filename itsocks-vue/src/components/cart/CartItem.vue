<script setup lang="ts">
import type { CartItem } from '@/types'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  item: CartItem
}>()

const cartStore = useCartStore()

function increment() {
  cartStore.addOneToItem(props.item.product.id, props.item.size.id)
}

function decrement() {
  cartStore.subtractOneFromItem(props.item.product.id, props.item.size.id)
}

function remove() {
  cartStore.removeItem(props.item.product.id, props.item.size.id)
}

const imageUrl = props.item.product.images?.[0]?.url ?? 'https://via.placeholder.com/100?text=ItSocks'
const subtotal = () => props.item.price * props.item.quantity
</script>

<template>
  <div data-testid="cart-item" class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <!-- Image -->
    <img
      :src="imageUrl"
      :alt="item.product.name"
      class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
    />

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h4 class="font-medium text-gray-900 text-sm truncate">{{ item.product.name }}</h4>
      <p class="text-sm text-gray-500">Talla: {{ item.size.name }}</p>
      <p class="text-sm text-brand-accent font-semibold mt-1">{{ formatCurrency(item.price) }}</p>
    </div>

    <!-- Quantity controls -->
    <div class="flex items-center gap-2">
      <button
        @click="decrement"
        data-testid="qty-decrease"
        class="w-7 h-7 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors text-sm"
      >
        -
      </button>
      <span data-testid="cart-item-qty" class="w-6 text-center text-sm font-medium">
        {{ item.quantity }}
      </span>
      <button
        @click="increment"
        data-testid="qty-increase"
        class="w-7 h-7 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors text-sm"
      >
        +
      </button>
    </div>

    <!-- Subtotal -->
    <div class="text-right min-w-16">
      <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(subtotal()) }}</p>
    </div>

    <!-- Remove -->
    <button
      @click="remove"
      data-testid="remove-item-btn"
      class="text-gray-400 hover:text-red-500 transition-colors"
      aria-label="Eliminar del carrito"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
