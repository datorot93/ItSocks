<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CartSummary from '@/components/cart/CartSummary.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useCartStore } from '@/stores/cartStore'
import { useShippingStore } from '@/stores/shippingStore'
import { useDiscountStore } from '@/stores/discountStore'
import { usePreferenceStore } from '@/stores/preferenceStore'
import { useMercadoPago } from '@/composables/useMercadoPago'
import { orderApi } from '@/api/orderApi'
import { formatCurrency } from '@/utils/formatters'

const router = useRouter()
const cartStore = useCartStore()
const shippingStore = useShippingStore()
const discountStore = useDiscountStore()
const preferenceStore = usePreferenceStore()
const { initWallet, destroyBricks } = useMercadoPago()

const isGift = ref(false)
const giftFrom = ref('')
const giftTo = ref('')

const discountInput = ref('')
const creatingOrder = ref(false)
const mpLoaded = ref(false)
const orderError = ref<string | null>(null)

// Shipping info from previous step
const shippingInfo = JSON.parse(sessionStorage.getItem('checkout_shipping') ?? '{}')

async function applyDiscount() {
  if (!discountInput.value.trim()) return
  await discountStore.validateCode(discountInput.value.trim(), cartStore.total)
}

function removeDiscount() {
  discountStore.clearDiscount()
  discountInput.value = ''
}

async function createOrderAndLoadMP() {
  if (cartStore.itemCount === 0) {
    router.push('/carrito')
    return
  }

  creatingOrder.value = true
  orderError.value = null

  try {
    const items = cartStore.items.map((i) => ({
      product_id: i.product.id,
      size_id: i.size.id,
      quantity: i.quantity,
      price: i.price,
      pack_id: i.pack_id,
    }))

    const payload = {
      customer_name: `${shippingInfo.name ?? 'Cliente'} ${shippingInfo.lastName ?? ''}`.trim(),
      email: shippingInfo.email ?? '',
      phone: shippingInfo.phone ?? '',
      document: shippingInfo.document ?? '',
      department: shippingInfo.department ?? '',
      city: shippingInfo.city ?? '',
      address: shippingInfo.address ?? '',
      billing_address: shippingInfo.address ?? '',
      is_gift: isGift.value,
      gift_from: isGift.value ? giftFrom.value : undefined,
      gift_to: isGift.value ? giftTo.value : undefined,
      discount_code: discountStore.code || undefined,
      items,
    }

    const response = await orderApi.createOrder(payload)
    const { preference_id, order } = response.data

    preferenceStore.setPreference(preference_id, order.id)

    // Load MP Bricks
    await initWallet('mp-checkout', preference_id)
    mpLoaded.value = true
  } catch {
    orderError.value = 'Error al procesar el pedido. Intenta de nuevo.'
  } finally {
    creatingOrder.value = false
  }
}

onMounted(() => {
  if (cartStore.itemCount === 0) {
    router.push('/carrito')
    return
  }
  createOrderAndLoadMP()
})

import { onUnmounted } from 'vue'
onUnmounted(() => destroyBricks())
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Gift option -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="font-semibold text-gray-900 mb-3">¿Es un regalo?</h3>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="isGift"
              type="checkbox"
              class="w-4 h-4 text-brand-accent rounded border-gray-300"
            />
            <span class="text-sm text-gray-700">Marcar como regalo</span>
          </label>
          <div v-if="isGift" class="mt-4 space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">De</label>
              <input
                v-model="giftFrom"
                type="text"
                placeholder="Tu nombre"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Para</label>
              <input
                v-model="giftTo"
                type="text"
                placeholder="Nombre del destinatario"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>

        <!-- Discount code -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="font-semibold text-gray-900 mb-3">Código de descuento</h3>
          <div v-if="!discountStore.applied" class="flex gap-2">
            <input
              v-model="discountInput"
              data-testid="discount-input"
              type="text"
              placeholder="Ingresa tu código"
              class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
              @keyup.enter="applyDiscount"
            />
            <button
              @click="applyDiscount"
              data-testid="apply-discount-btn"
              :disabled="discountStore.loading"
              class="btn-secondary px-4 py-2 text-sm"
            >
              {{ discountStore.loading ? '...' : 'Aplicar' }}
            </button>
          </div>
          <div
            v-if="discountStore.applied"
            data-testid="discount-applied"
            class="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2"
          >
            <span class="text-sm text-green-800">
              Descuento aplicado: -{{ formatCurrency(discountStore.discountAmount) }}
            </span>
            <button
              @click="removeDiscount"
              data-testid="remove-discount-btn"
              class="text-sm text-red-500 hover:underline"
            >
              Quitar
            </button>
          </div>
          <p v-if="discountStore.error" class="text-xs text-red-500 mt-1">{{ discountStore.error }}</p>
        </div>

        <!-- MercadoPago Bricks -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Método de pago</h3>

          <div v-if="creatingOrder" class="flex items-center justify-center py-8">
            <Spinner size="md" />
            <span class="ml-3 text-sm text-gray-600">Preparando pago...</span>
          </div>

          <div v-if="orderError" class="text-red-600 text-sm py-4">
            {{ orderError }}
            <button @click="createOrderAndLoadMP" class="ml-2 text-brand-accent hover:underline">
              Reintentar
            </button>
          </div>

          <div id="mp-checkout" class="min-h-[50px]">
            <p v-if="!creatingOrder && !orderError && !mpLoaded" class="text-sm text-gray-400 text-center py-3">
              Cargando MercadoPago...
            </p>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div>
        <CartSummary />
        <div class="mt-4 text-xs text-gray-500 text-center" data-testid="order-summary">
          <p>Al continuar aceptas nuestros</p>
          <RouterLink to="/politica-de-datos" class="text-brand-accent hover:underline">
            términos y política de datos
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
