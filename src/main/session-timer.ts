import { webContents } from 'electron'
import { createLockScreenWindow } from './lockscreen'

let interval: NodeJS.Timeout | null = null

let startAt: number | null = null
let endAt: number | null = null

export const startTimer = (startTime: number, endTime: number): void => {
  startAt = startTime
  endAt = endTime

  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    if (!endAt) return

    const remainingMs = Math.max(0, endAt - Date.now())
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

export const updateTime = (startTime: number, endTime: number): void => {
  startAt = startTime
  endAt = endTime
}

export const stopTimer = (): void => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  startAt = null
  endAt = null

  webContents.getAllWebContents().forEach((wc) => {
    wc.send('timer-stop')
  })
}

export const getStartAt = (): number | null => {
  return startAt
}

export const getEndAt = (): number | null => {
  return endAt
}

export const getRemainingSeconds = (): number => {
  if (!endAt) return 0
  const remainingMs = Math.max(0, endAt - Date.now())
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  return remainingSeconds
}
