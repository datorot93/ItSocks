import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productApi } from '@/api/productApi'

export const useDiscountStore = defineStore(
  'discount',
  () => {
    const code = ref<string>('')
    const discountAmount = ref<number>(0)
    const discountType = ref<'percentage' | 'fixed'>('percentage')
    const discountValue = ref<number>(0)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const applied = ref(false)

    const hasDiscount = computed(() => applied.value && discountAmount.value > 0)

    async function validateCode(discountCode: string, subtotal: number) {
      loading.value = true
      error.value = null
      try {
        const response = await productApi.validateDiscount(discountCode)
        const data = response.data
        if (data.valid) {
          code.value = discountCode
          discountType.value = data.type as 'percentage' | 'fixed'
          discountValue.value = data.discount

          if (data.type === 'percentage') {
            discountAmount.value = Math.round((subtotal * data.discount) / 100)
          } else {
            discountAmount.value = data.discount
          }
          applied.value = true
        } else {
          const msg = data.message ?? 'Código no válido'
          clearDiscount()
          error.value = msg
        }
      } catch {
        const msg = 'Error al validar el código'
        clearDiscount()
        error.value = msg
      } finally {
        loading.value = false
      }
    }

    function clearDiscount() {
      code.value = ''
      discountAmount.value = 0
      discountType.value = 'percentage'
      discountValue.value = 0
      applied.value = false
      error.value = null
    }

    return {
      code,
      discountAmount,
      discountType,
      discountValue,
      loading,
      error,
      applied,
      hasDiscount,
      validateCode,
      clearDiscount,
    }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
