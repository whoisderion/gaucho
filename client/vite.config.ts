import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      host: true,
      proxy: {
        "/api":  {
            target:  env.VITE_SERVER_URL,
            rewrite: (path) => path.replace(/^\/api/, env.VITE_SERVER_URL),
          }
      }
    }
  }
})
