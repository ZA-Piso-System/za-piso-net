import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          initialsetupscreen: resolve(__dirname, 'src/renderer/initialsetupscreen/index.html'),
          lockscreen: resolve(__dirname, 'src/renderer/lockscreen/index.html'),
          timerscreen: resolve(__dirname, 'src/renderer/timerscreen/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react()]
  }
})
