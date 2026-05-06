import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShippingCity } from '@/types'
import { shippingApi } from '@/api/shippingApi'

export const useShippingStore = defineStore(
  'shipping',
  () => {
    const selectedCity = ref<ShippingCity | null>(null)
    const selectedDepartment = ref<string>('')
    const shippingRate = ref<number>(0)
    const estimatedDays = ref<number>(0)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const hasShipping = computed(() => selectedCity.value !== null)

    function setCity(city: ShippingCity) {
      selectedCity.value = city
      shippingRate.value = city.rate
      estimatedDays.value = city.estimated_days ?? 3
    }

    function setDepartment(dept: string) {
      selectedDepartment.value = dept
      selectedCity.value = null
      shippingRate.value = 0
    }

    async function fetchRate(cityId: number) {
      loading.value = true
      error.value = null
      try {
        const response = await shippingApi.getShippingRate(cityId)
        shippingRate.value = response.data.rate
        estimatedDays.value = response.data.estimated_days
      } catch (e) {
        error.value = 'No se pudo obtener la tarifa de envío'
      } finally {
        loading.value = false
      }
    }

    function clearShipping() {
      selectedCity.value = null
      selectedDepartment.value = ''
      shippingRate.value = 0
      estimatedDays.value = 0
    }

    return {
      selectedCity,
      selectedDepartment,
      shippingRate,
      estimatedDays,
      loading,
      error,
      hasShipping,
      setCity,
      setDepartment,
      fetchRate,
      clearShipping,
    }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
