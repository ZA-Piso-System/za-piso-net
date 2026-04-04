import { useDeviceConfig } from '@renderer/hooks/useDeviceConfig'
import { secondsToHMS } from '@renderer/utils/number.util'
import { LogOutIcon } from 'lucide-react'
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

  const handleExit = (): void => {
    window.electron.ipcRenderer.invoke('exit')
  }

  return (
    <div className="h-screen flex">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-800 w-36 flex justify-center items-center">
        <h1 className="text-6xl text-white font-bold font-[Audiowide]">
          {config?.deviceNumber.toString().padStart(2, '0')}
        </h1>
      </div>
      <div className="relative flex-1 flex justify-center items-center text-3xl font-mono p-2">
        {secondsToHMS(remaining)}
        <div className="absolute bottom-2">
          <button
            className="bg-gray-600 hover:bg-gray-400 text-white p-2 rounded-md"
            onClick={handleExit}
          >
            <LogOutIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
