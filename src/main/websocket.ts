import WebSocket from 'ws'
import config from './config'
import { createLockScreenWindow } from './lockscreen'
import { addTime, getRemainingSeconds, startTimer, stopTimer } from './session-timer'
import { createTimerScreenWindow } from './timerscreen'
import { ClientEvents } from '../common/constants/client-events.constant'
import { SessionEvents } from '../common/constants/session-events.constant'

let ws: WebSocket
let heartbeatInterval: NodeJS.Timeout
let reconnectTimeout: NodeJS.Timeout | null = null

export const initializeWebsocket = async (): Promise<void> => {
  ws = new WebSocket(`ws://${config.host}:5000/ws`)

  ws.on('open', function open() {
    console.log('Websocket Connected')

    ws.send(
      JSON.stringify({
        type: ClientEvents.Ready,
        payload: 'device-id-here'
      })
    )

    startHeartbeat()
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
    console.log('sending heartbeat')

    ws.send(
      JSON.stringify({
        type: ClientEvents.Heartbeat,
        payload: {
          deviceId: 'device-id-here',
          status: 'active',
          remainingTime: getRemainingSeconds()
        }
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
    case SessionEvents.AddTime:
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
    case SessionEvents.Stop:
      createLockScreenWindow()
      stopTimer()
      break
    default:
      console.warn('unknown event', event.type)
  }
}
