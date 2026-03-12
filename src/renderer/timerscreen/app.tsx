import { useAppConfig } from '@renderer/hooks/useAppConfig'
import { useEffect, useState } from 'react'

export default function App(): React.JSX.Element {
  const config = useAppConfig()
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
      <div className="w-36 flex justify-center items-center bg-black">
        <h1 className="text-6xl text-purple-500 font-bold font-mono">
          {config?.pc_no.toString().padStart(2, '0')}
        </h1>
      </div>
      <div className="flex-1 flex justify-center items-center text-3xl font-mono p-2">
        {secondsToHMS()}
      </div>
    </div>
  )
}
