import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

config({ path: './.env' })

// https://vite.dev/config/
export default defineConfig({
  root: 'client-side',
  plugins: [react()],
})
