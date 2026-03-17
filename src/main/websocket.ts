import WebSocket from 'ws'
import { ClientEvent } from '../common/types/client-event.type'
import { Client } from '../common/types/client.type'
import { ServerEvent } from '../common/types/server-event.type'
import { SessionEvent } from '../common/types/session-event.type'
import { getAppConfig } from './config/app.config'
import { getDeviceConfig } from './config/device.config'
import { createLockScreenWindow } from './lockscreen'
import { getRemainingSeconds, startTimer, stopTimer, updateTime } from './session-timer'
import { createTimerScreenWindow } from './timerscreen'
import { Session } from '../common/types/session.type'

let ws: WebSocket
let heartbeatInterval: NodeJS.Timeout
let reconnectTimeout: NodeJS.Timeout | null = null

export const initializeWebsocket = async (): Promise<void> => {
  const appConfig = getAppConfig()
  const deviceConfig = getDeviceConfig()

  if (!appConfig || !deviceConfig) return

  ws = new WebSocket(appConfig.wsUrl)

  ws.on('open', function open() {
    ws.send(
      JSON.stringify({
        type: ClientEvent.Ready,
        payload: {
          id: deviceConfig.id
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
  const deviceConfig = getDeviceConfig()

  if (!deviceConfig) return

  heartbeatInterval = setInterval(() => {
    if (!ws || ws.readyState !== ws.OPEN) return

    ws.send(
      JSON.stringify({
        type: ClientEvent.Heartbeat,
        payload: {
          id: deviceConfig.id
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
  }, 3_000)
}

const handleEvent = (event: { type: string; payload?: unknown }): void => {
  switch (event.type) {
    case ServerEvent.Ack:
      {
        const payload = event.payload as Session
        setTimeout(() => {
          if (payload.startAt && payload.endAt) {
            createTimerScreenWindow()
            startTimer(payload.startAt, payload.endAt)
          }
        }, 2_000)
        startHeartbeat()
      }
      break
    case SessionEvent.AddTime:
      {
        const payload = event.payload as Session
        if (payload.startAt && payload.endAt) {
          if (getRemainingSeconds() <= 0) {
            createTimerScreenWindow()
            startTimer(payload.startAt, payload.endAt)
          } else {
            updateTime(payload.startAt, payload.endAt)
          }
        }
      }
      break
    case SessionEvent.Stop:
      createLockScreenWindow()
      stopTimer()
      break
    default:
      console.warn('Unknown event', event.type)
  }
}
