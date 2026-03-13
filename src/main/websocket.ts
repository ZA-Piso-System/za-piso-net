import WebSocket from 'ws'
import config from './config'
import { createLockScreenWindow } from './lockscreen'
import {
  addTime,
  getEndAt,
  getRemainingSeconds,
  getStartAt,
  getStatus,
  startTimer,
  stopTimer
} from './session-timer'
import { createTimerScreenWindow } from './timerscreen'
import { ClientEvent } from '../common/types/client-event.type'
import { SessionEvent } from '../common/types/session-event.type'
import { ServerEvent } from '../common/types/server-event.type'
import { Client } from '../common/types/client.type'

let ws: WebSocket
let heartbeatInterval: NodeJS.Timeout
let reconnectTimeout: NodeJS.Timeout | null = null

export const initializeWebsocket = async (): Promise<void> => {
  ws = new WebSocket(config.wsUrl)

  ws.on('open', function open() {
    ws.send(
      JSON.stringify({
        type: ClientEvent.Ready,
        payload: {
          deviceId: config.deviceId,
          pcNo: config.pcNo,
          status: getStatus(),
          startAt: getStartAt(),
          endAt: getEndAt(),
          remainingSeconds: getRemainingSeconds(),
          lastSeen: Date.now()
        } satisfies Client
      })
    )
  })

  ws.on('message', function message(data) {
    try {
      const event = JSON.parse(data.toString())
      handleEvent(event)
    } catch (error) {
      console.error('Invalid data', error)
    }
  })

  ws.on('close', () => {
    console.log('WebSocket disconnected. Reconnecting in 3s')
    stopHeartbeat()
    reconnect()
  })

  ws.on('error', console.error)
}

const startHeartbeat = (): void => {
  heartbeatInterval = setInterval(() => {
    if (!ws || ws.readyState !== ws.OPEN) return

    ws.send(
      JSON.stringify({
        type: ClientEvent.Heartbeat,
        payload: {
          deviceId: config.deviceId,
          pcNo: config.pcNo,
          status: getStatus(),
          startAt: getStartAt(),
          endAt: getEndAt(),
          remainingSeconds: getRemainingSeconds(),
          lastSeen: Date.now()
        } satisfies Client
      })
    )
  }, 5_000)
}

const stopHeartbeat = (): void => {
  clearInterval(heartbeatInterval)
}

const reconnect = (): void => {
  if (reconnectTimeout) return

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null
    initializeWebsocket()
  }, 3000)
}

const handleEvent = (event: { type: string; payload?: unknown }): void => {
  switch (event.type) {
    case ServerEvent.Ack:
      startHeartbeat()
      break
    case SessionEvent.AddTime:
      {
        const seconds = event.payload as number
        if (getRemainingSeconds() <= 0) {
          createTimerScreenWindow()
          startTimer(seconds)
        } else {
          addTime(seconds)
        }
      }
      break
    case SessionEvent.Stop:
      createLockScreenWindow()
      stopTimer()
      break
    default:
      console.warn('unknown event', event.type)
  }
}
