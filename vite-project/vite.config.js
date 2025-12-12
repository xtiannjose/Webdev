import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a relative base so the built site works when opened from the file system or any subpath.
export default defineConfig({
  plugins: [react()],
  base: './',
})
