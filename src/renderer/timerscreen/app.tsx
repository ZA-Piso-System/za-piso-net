import { useEffect, useState } from 'react'

export default function App(): React.JSX.Element {
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
    <div className="h-screen flex justify-center items-center">
      <div className="text-5xl text-purple-500 font-mono">{secondsToHMS()}</div>
    </div>
  )
}
