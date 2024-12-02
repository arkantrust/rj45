import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public', // relative to src
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})