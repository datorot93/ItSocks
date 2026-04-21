import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/reducers/orderReducer.js',
        'src/hooks/useOrder.js',
        'src/hooks/useOrderReducer.js',
        'src/context/order.jsx',
        'src/itsocks/helpers/setOrder.js',
        'src/itsocks/components/FinishOrderForm.jsx',
        'src/itsocks/pages/FinishOrder.jsx',
        'src/itsocks/pages/OrderDescription.jsx',
      ],
    },
  },
})
