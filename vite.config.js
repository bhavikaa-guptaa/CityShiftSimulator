
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/CityShiftSimulator/',   // ← ADD THIS LINE
  plugins: [react()],
})
