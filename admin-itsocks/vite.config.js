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
        'src/Order/OrderList.jsx',
        'src/Order/OrderEdit.jsx',
        'src/Order/index.js',
        'src/OrderReport/OrderReportrList.jsx',
        'src/OrderReport/OrderReportCreate.jsx',
        'src/OrderReport/OrderReportEdit.jsx',
        'src/OrderReport/index.js',
      ],
    },
  },
})
