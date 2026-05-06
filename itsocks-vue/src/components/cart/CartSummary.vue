<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useShippingStore } from '@/stores/shippingStore'
import { useDiscountStore } from '@/stores/discountStore'
import { formatCurrency } from '@/utils/formatters'

const cartStore = useCartStore()
const shippingStore = useShippingStore()
const discountStore = useDiscountStore()

const subtotal = computed(() => cartStore.total)
const shipping = computed(() => shippingStore.shippingRate)
const discount = computed(() => discountStore.discountAmount)
const total = computed(() => subtotal.value + shipping.value - discount.value)
</script>

<template>
  <div class="bg-gray-50 rounded-xl p-5">
    <h3 class="font-semibold text-gray-900 mb-4">Resumen de Compra</h3>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Envío</span>
        <span v-if="shipping > 0">{{ formatCurrency(shipping) }}</span>
        <span v-else class="text-gray-400">—</span>
      </div>
      <div v-if="discount > 0" class="flex justify-between text-green-700">
        <span>Descuento</span>
        <span>-{{ formatCurrency(discount) }}</span>
      </div>
      <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2 text-base">
        <span>Total</span>
        <span data-testid="cart-total">{{ formatCurrency(total) }}</span>
      </div>
    </div>
  </div>
</template>
