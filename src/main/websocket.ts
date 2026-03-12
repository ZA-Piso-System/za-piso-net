import WebSocket from 'ws'
import { addTime, getRemainingSeconds, startTimer, stopTimer } from './session-timer'
import { createTimerScreenWindow } from './timerscreen'
import { createLockScreenWindow } from './lockscreen'
import { discoverTimerServer } from './discovery'

let reconnectTimeout: NodeJS.Timeout | null = null

export const initializeWebsocket = async (configHost: string): Promise<void> => {
  const host = await getServerHost(configHost)

  const ws = new WebSocket(`ws://${host}:5000/ws`)

  ws.on('open', function open() {
    console.log('Websocket Connected')

    ws.send(
      JSON.stringify({
        type: 'client:ready',
        payload: 'device-id-here'
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

    reconnect(configHost)
  })

  ws.on('error', console.error)
}

const reconnect = (configHost: string): void => {
  if (reconnectTimeout) return

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null
    initializeWebsocket(configHost)
  }, 3000)
}

const getServerHost = async (configHost: string): Promise<string> => {
  if (configHost !== 'local' && configHost !== 'localhost') {
    return configHost // fixed IP
  }
  if (configHost === 'localhost') {
    return '127.0.0.1'
  }
  return await discoverTimerServer()
}

const handleEvent = (event: { type: string; payload?: unknown }): void => {
  switch (event.type) {
    case 'session:add-time':
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
    case 'session:stop':
      createLockScreenWindow()
      stopTimer()
      break
    default:
      console.warn('unknown event', event.type)
  }
}
