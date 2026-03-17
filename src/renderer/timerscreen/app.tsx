import { useDeviceConfig } from '@renderer/hooks/useDeviceConfig'
import { useEffect, useState } from 'react'

export default function App(): React.JSX.Element {
  const config = useDeviceConfig()
  const [remaining, setRemaining] = useState<number>(0)

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'timer-update',
      (_event: unknown, ms: number): void => {
        setRemaining(ms)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const secondsToHMS = (): string => {
    const hours = Math.floor(remaining / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)
    const seconds = remaining % 60

    const formatted = [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':')

    return formatted
  }

  return (
    <div className="h-screen flex">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-800 w-36 flex justify-center items-center">
        <h1 className="text-6xl text-white font-bold font-[Audiowide]">
          {config?.deviceNumber.toString().padStart(2, '0')}
        </h1>
      </div>
      <div className="flex-1 flex justify-center items-center text-3xl font-mono p-2">
        {secondsToHMS()}
      </div>
    </div>
  )
}
