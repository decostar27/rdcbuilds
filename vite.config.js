import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // relative asset paths: works on GitHub Pages (/rdcbuilds/), Vercel, Netlify or a custom domain
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    // The project lives in OneDrive, where native file events are unreliable;
    // polling makes sure every CSS/JS change reaches the browser.
    watch: { usePolling: true, interval: 300 },
  },
})
