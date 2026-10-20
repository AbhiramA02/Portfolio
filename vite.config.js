import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (abhiramagina.xyz) serves from site root — keep base at "/".
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
