import { exec } from 'child_process'
import { webContents } from 'electron'

const AUTO_SHUTDOWN_TIME = 3 * 60

let interval: NodeJS.Timeout | null = null
let countdown: number | null = null

export const startAutoShutdownTimer = (): void => {
  stopAutoShutdownTimer()

  countdown = AUTO_SHUTDOWN_TIME

  interval = setInterval(() => {
    if (!countdown) return

    countdown--

    webContents.getAllWebContents().forEach((wc) => {
      wc.send('shutdown-update', countdown)
    })

    if (countdown <= 0) {
      stopAutoShutdownTimer()
      performShutdown()
    }
  }, 1000)
}

export const stopAutoShutdownTimer = (): void => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

export const performShutdown = (): void => {
  exec('shutdown /s /t 0', (err) => {
    if (err) console.error('Shutdown failed:', err)
  })
}
