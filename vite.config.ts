import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // the Cloudflare Worker subproject writes its local D1 database here;
      // without this, every API call during local dev triggers a full page reload
      ignored: ['**/worker/**'],
    },
  },
})
