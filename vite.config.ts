import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/text-enhancement-ui/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})