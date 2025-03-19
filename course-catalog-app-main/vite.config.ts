/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: ['./setupTests.ts'],
    exclude: [...configDefaults.exclude, './e2e-tests']
  }
})
