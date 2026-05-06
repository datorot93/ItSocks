import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Pack } from '@/types'

export const usePackStore = defineStore(
  'pack',
  () => {
    const selectedPack = ref<Pack | null>(null)

    function setSelectedPack(pack: Pack) {
      selectedPack.value = pack
    }

    function clearPack() {
      selectedPack.value = null
    }

    return { selectedPack, setSelectedPack, clearPack }
  },
  // @ts-ignore -- pinia-plugin-persistedstate augments persist at runtime
  { persist: true },
)
