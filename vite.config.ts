import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    crx({ manifest: manifest as any }),
  ],
  build: {
    rollupOptions: {
      input: {
        onboarding: 'onboarding.html',
      },
    },
  },
})
