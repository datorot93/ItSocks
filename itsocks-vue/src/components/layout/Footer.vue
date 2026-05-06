<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-brand-DEFAULT text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <h3 class="text-xl font-bold mb-3">ItSocks</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            Medias con diseño exclusivo para Colombia. Calidad y estilo en cada par.
          </p>
        </div>

        <!-- Categorías -->
        <div>
          <h4 class="font-semibold mb-3 text-gray-200">Categorías</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><RouterLink to="/medias/estampadas" class="hover:text-white transition-colors">Estampadas</RouterLink></li>
            <li><RouterLink to="/medias/lisas" class="hover:text-white transition-colors">Lisas</RouterLink></li>
            <li><RouterLink to="/medias/pantorrilleras" class="hover:text-white transition-colors">Pantorrilleras</RouterLink></li>
            <li><RouterLink to="/medias/tejidas" class="hover:text-white transition-colors">Tejidas</RouterLink></li>
            <li><RouterLink to="/packs" class="hover:text-white transition-colors">Packs</RouterLink></li>
          </ul>
        </div>

        <!-- Ayuda -->
        <div>
          <h4 class="font-semibold mb-3 text-gray-200">Ayuda</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><RouterLink to="/guia-de-tallas" class="hover:text-white transition-colors">Guía de Tallas</RouterLink></li>
            <li><RouterLink to="/envios" class="hover:text-white transition-colors">Envíos y Garantías</RouterLink></li>
            <li><RouterLink to="/faq" class="hover:text-white transition-colors">Preguntas Frecuentes</RouterLink></li>
            <li><RouterLink to="/politica-de-datos" class="hover:text-white transition-colors">Política de Datos</RouterLink></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h4 class="font-semibold mb-3 text-gray-200">Contacto</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>Colombia</li>
            <li>
              <a href="https://instagram.com/itsocks" target="_blank" rel="noopener" class="hover:text-white transition-colors">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} ItSocks. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>
