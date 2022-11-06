/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  test: {},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@promise': path.resolve(__dirname, 'src/promise'),
    },
  },
})
