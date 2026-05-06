<script setup lang="ts">
import { ref } from 'vue'

const faqs = [
  {
    q: '¿Cuánto tiempo tarda mi pedido?',
    a: 'Los pedidos se entregan en 2-5 días hábiles dependiendo de tu ciudad. Bogotá: 2-3 días. Resto del país: 3-5 días.'
  },
  {
    q: '¿Cómo puedo hacer un cambio de talla?',
    a: 'Contáctanos dentro de los 15 días siguientes a la recepción del pedido. El producto debe estar en perfectas condiciones.'
  },
  {
    q: '¿Cómo sé cuál es mi talla?',
    a: 'Consulta nuestra guía de tallas disponible en el menú. Si tienes dudas, contáctanos y te ayudamos.'
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos tarjetas de crédito y débito, PSE y otros métodos disponibles en MercadoPago.'
  },
  {
    q: '¿Hacen envíos a toda Colombia?',
    a: 'Sí, enviamos a todos los municipios de Colombia a través de servicios de mensajería.'
  },
]

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h1>
    <div class="space-y-3">
      <div
        v-for="(faq, i) in faqs"
        :key="i"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <button
          @click="toggle(i)"
          class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span class="font-medium text-gray-900 text-sm">{{ faq.q }}</span>
          <svg
            :class="['w-4 h-4 text-gray-400 transition-transform', openIndex === i ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="openIndex === i" class="px-5 pb-4 text-sm text-gray-600">
          {{ faq.a }}
        </div>
      </div>
    </div>
  </div>
</template>
