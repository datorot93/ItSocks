<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import CartSummary from '@/components/cart/CartSummary.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useCartStore } from '@/stores/cartStore'
import { useShippingStore } from '@/stores/shippingStore'
import { shippingApi } from '@/api/shippingApi'
import { formatCurrency } from '@/utils/formatters'
import type { ShippingCity, ShippingDepartment } from '@/types'

const router = useRouter()
const cartStore = useCartStore()
const shippingStore = useShippingStore()

// Form data
const form = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  document: '',
  department: '',
  city: '',
  address: '',
  notes: '',
})

const departments = ref<ShippingDepartment[]>([])
const cities = ref<ShippingCity[]>([])
const loadingDepts = ref(false)
const loadingCities = ref(false)
const formErrors = ref<Record<string, string>>({})

onMounted(async () => {
  if (cartStore.itemCount === 0) {
    router.push('/carrito')
    return
  }
  loadingDepts.value = true
  try {
    const response = await shippingApi.getDepartments()
    departments.value = response.data
  } catch {
    // silently fail
  } finally {
    loadingDepts.value = false
  }
})

async function loadCities(dept: string) {
  loadingCities.value = true
  cities.value = []
  form.value.city = ''
  shippingStore.setDepartment(dept)
  try {
    const response = await shippingApi.getCitiesByDepartment(dept)
    cities.value = response.data
  } catch {
    // fallback
  } finally {
    loadingCities.value = false
  }
}

function onCityChange(cityName: string) {
  const city = cities.value.find((c) => c.name === cityName)
  if (city) {
    shippingStore.setCity(city)
  }
}

const shippingCost = computed(() => shippingStore.shippingRate)

function validate(): boolean {
  formErrors.value = {}
  const f = form.value
  if (!f.name.trim()) formErrors.value.name = 'Nombre requerido'
  if (!f.lastName.trim()) formErrors.value.lastName = 'Apellido requerido'
  if (!f.email.trim() || !f.email.includes('@')) formErrors.value.email = 'Email inválido'
  if (!f.phone.trim()) formErrors.value.phone = 'Teléfono requerido'
  if (!f.department) formErrors.value.department = 'Departamento requerido'
  if (!f.city) formErrors.value.city = 'Ciudad requerida'
  if (!f.address.trim()) formErrors.value.address = 'Dirección requerida'
  return Object.keys(formErrors.value).length === 0
}

function next() {
  if (!validate()) return
  // Persist shipping info in session storage for next page
  sessionStorage.setItem('checkout_shipping', JSON.stringify(form.value))
  router.push('/billing')
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Información de Envío</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2">
        <form @submit.prevent="next" class="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="form.name"
                data-testid="input-name"
                type="text"
                placeholder="Juan"
                :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-accent']"
              />
              <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                v-model="form.lastName"
                data-testid="input-lastname"
                type="text"
                placeholder="Pérez"
                :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.lastName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-accent']"
              />
              <p v-if="formErrors.lastName" class="text-xs text-red-500 mt-1">{{ formErrors.lastName }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              data-testid="input-email"
              type="email"
              placeholder="juan@ejemplo.com"
              :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.email ? 'border-red-400' : 'border-gray-300 focus:ring-brand-accent']"
            />
            <p v-if="formErrors.email" class="text-xs text-red-500 mt-1">{{ formErrors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="form.phone"
              data-testid="input-phone"
              type="tel"
              placeholder="3001234567"
              :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.phone ? 'border-red-400' : 'border-gray-300 focus:ring-brand-accent']"
            />
            <p v-if="formErrors.phone" class="text-xs text-red-500 mt-1">{{ formErrors.phone }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
              v-model="form.department"
              data-testid="department-select"
              @change="loadCities(form.department)"
              :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.department ? 'border-red-400' : 'border-gray-300 focus:ring-brand-accent']"
            >
              <option value="" disabled>Selecciona un departamento</option>
              <option v-for="dept in departments" :key="dept.name" :value="dept.name">
                {{ dept.name }}
              </option>
            </select>
            <p v-if="formErrors.department" class="text-xs text-red-500 mt-1">{{ formErrors.department }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <div class="relative">
              <select
                v-model="form.city"
                data-testid="city-select"
                :disabled="!form.department || loadingCities"
                @change="onCityChange(form.city)"
                :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.city ? 'border-red-400' : 'border-gray-300 focus:ring-brand-accent']"
              >
                <option value="" disabled>{{ loadingCities ? 'Cargando ciudades...' : 'Selecciona una ciudad' }}</option>
                <option v-for="city in cities" :key="city.id" :value="city.name">
                  {{ city.name }}
                </option>
              </select>
            </div>
            <p v-if="formErrors.city" class="text-xs text-red-500 mt-1">{{ formErrors.city }}</p>
          </div>

          <!-- Shipping cost display -->
          <div v-if="shippingCost > 0" class="flex justify-between items-center bg-blue-50 rounded-md px-3 py-2 text-sm">
            <span class="text-gray-700">Costo de envío estimado:</span>
            <span data-testid="shipping-cost" class="font-semibold text-brand-DEFAULT">
              {{ formatCurrency(shippingCost) }}
            </span>
          </div>
          <div v-else-if="form.city" class="text-xs text-gray-500">
            <span data-testid="shipping-cost">—</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Calle 123 # 45-67"
              :class="['w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1', formErrors.address ? 'border-red-400' : 'border-gray-300 focus:ring-brand-accent']"
            />
            <p v-if="formErrors.address" class="text-xs text-red-500 mt-1">{{ formErrors.address }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas adicionales (opcional)</label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent resize-none"
            />
          </div>

          <!-- Order total -->
          <div class="flex justify-between items-center pt-2 border-t border-gray-100">
            <span class="font-medium text-gray-700">Total estimado:</span>
            <span data-testid="order-total" class="font-bold text-brand-DEFAULT text-lg">
              {{ formatCurrency(cartStore.total + shippingCost) }}
            </span>
          </div>

          <button
            type="submit"
            data-testid="next-step-btn"
            class="w-full bg-brand-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continuar al pago
          </button>
        </form>
      </div>

      <!-- Summary -->
      <div>
        <CartSummary />
      </div>
    </div>
  </div>
</template>
