import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // tsconfig.app.json의 paths(`@/*`)를 그대로 쓴다. 별칭을 두 곳에 적지 않기 위해서다.
    tsconfigPaths: true,
  },
})
