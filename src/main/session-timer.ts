import { webContents } from 'electron'
import { createLockScreenWindow } from './lockscreen'

let endTime: number | null = null
let interval: NodeJS.Timeout | null = null

export const startTimer = (duration: number): void => {
  endTime = Date.now() + duration * 1000

  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    if (!endTime) return

    const remainingMs = Math.max(0, endTime - Date.now())
    const remainingSeconds = Math.ceil(remainingMs / 1000)

    webContents.getAllWebContents().forEach((wc) => {
      wc.send('timer-update', remainingSeconds)
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
