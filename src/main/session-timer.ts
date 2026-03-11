import { BrowserWindow } from 'electron'
import { createLockScreenWindow } from './lockscreen'

let endTime: number | null = null
let interval: NodeJS.Timeout | null = null

export const startTimer = (durationMs: number, windows: BrowserWindow[]): void => {
  endTime = Date.now() + durationMs

  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    if (!endTime) return

    const remainingMs = Math.max(0, endTime - Date.now())
    const remainingSeconds = Math.ceil(remainingMs / 1000)

    windows.forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send('timer-update', remainingSeconds)
      }
    })

    if (remainingSeconds <= 0) {
      stopTimer()
      createLockScreenWindow()
    }
  }, 1000)
}

export const stopTimer = (): void => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  endTime = null
}
