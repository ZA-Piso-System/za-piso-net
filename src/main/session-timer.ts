import { webContents } from 'electron'
import { createLockScreenWindow } from './lockscreen'
import { Status } from '../common/types/status.type'

let interval: NodeJS.Timeout | null = null

let status: Status = Status.Idle
let startAt: number | null = null
let endAt: number | null = null

export const startTimer = (duration: number): void => {
  status = Status.Active
  startAt = Date.now()
  endAt = Date.now() + duration * 1000

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

export const addTime = (seconds: number): void => {
  if (!endAt) return
  endAt += seconds * 1000
}

export const stopTimer = (): void => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  status = Status.Idle
  startAt = null
  endAt = null
}

export const getStartAt = (): number | null => {
  return startAt
}

export const getStatus = (): Status => {
  return status
}

export const getRemainingSeconds = (): number => {
  if (!endAt) return 0
  const remainingMs = Math.max(0, endAt - Date.now())
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  return remainingSeconds
}
