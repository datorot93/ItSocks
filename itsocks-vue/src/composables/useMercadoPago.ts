import { usePreferenceStore } from '@/stores/preferenceStore'

declare global {
  interface Window {
    MercadoPago: new (key: string, opts?: { locale?: string }) => MercadoPagoInstance
  }
}

interface MercadoPagoInstance {
  bricks: () => BricksBuilder
}

interface BricksBuilder {
  create: (
    type: string,
    containerId: string,
    config: BrickConfig,
  ) => Promise<BricksController>
}

interface BrickConfig {
  initialization?: { preferenceId: string }
  customization?: Record<string, unknown>
  callbacks?: {
    onReady?: () => void
    onError?: (error: unknown) => void
    onSubmit?: (data: unknown) => void
  }
}

interface BricksController {
  unmount: () => void
}

export function useMercadoPago() {
  const preferenceStore = usePreferenceStore()
  let bricksController: BricksController | null = null

  async function initWallet(containerId: string, preferenceId?: string) {
    const pid = preferenceId ?? preferenceStore.preferenceId
    if (!pid) {
      console.error('No preference ID available for MercadoPago')
      return
    }

    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY
    if (!publicKey || !window.MercadoPago) {
      console.error('MercadoPago SDK not loaded or public key missing')
      return
    }

    const mp = new window.MercadoPago(publicKey, { locale: 'es-CO' })
    const bricks = mp.bricks()

    bricksController = await bricks.create('wallet', `#${containerId}`, {
      initialization: { preferenceId: pid },
      customization: {
        texts: { valueProp: 'smart_option' },
      },
      callbacks: {
        onReady: () => {
          console.log('MercadoPago Bricks ready')
        },
        onError: (error) => {
          console.error('MercadoPago Bricks error:', error)
        },
      },
    })
  }

  function destroyBricks() {
    if (bricksController) {
      bricksController.unmount()
      bricksController = null
    }
  }

  return { initWallet, destroyBricks }
}
