import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferenceStore = defineStore(
  'preference',
  () => {
    const preferenceId = ref<string | null>(null)
    const orderId = ref<number | null>(null)

    function setPreference(id: string, oId?: number) {
      preferenceId.value = id
      if (oId) orderId.value = oId
    }

    function clearPreference() {
      preferenceId.value = null
      orderId.value = null
    }

    return { preferenceId, orderId, setPreference, clearPreference }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
