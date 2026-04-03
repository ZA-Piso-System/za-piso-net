import { secondsToHMS } from '@renderer/utils/number.util'
import { LucideLoader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BalanceResponse } from 'src/common/types/user.type'

interface Props {
  user: {
    name: string
  }
  onLogoutCallback: () => void
}

export const UserCard = ({ user, onLogoutCallback }: Props): React.JSX.Element => {
  const [remaining, setRemaining] = useState<number>(0)
  const [balance, setBalance] = useState<BalanceResponse | null>(null)

  const [isUsingTime, setIsUsingTime] = useState<boolean>(false)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadBalance()
  }, [])

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

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on('timer-stop', (_event: unknown): void => {
      setRemaining(0)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const loadBalance = async (): Promise<void> => {
    const result = await window.electron.ipcRenderer.invoke('get-balance')
    setBalance(result)
  }

  const handleResume = (): void => {
    window.electron.ipcRenderer.invoke('resume-time')
  }

  const handleUseTime = (): void => {
    setIsUsingTime(true)
    window.electron.ipcRenderer.invoke('use-time')
  }

  const handleSaveAndLogout = (): void => {
    setIsLoggingOut(true)
    window.electron.ipcRenderer.invoke('logout')
    setTimeout(() => onLogoutCallback(), 1_000)
  }

  return (
    <div className="bg-white flex flex-col gap-4 p-4 rounded-md">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Hi, {user.name} 👋</h1>
        {remaining > 0 ? (
          <div className="flex flex-col justify-center items-center p-2">
            <div className="text-2xl font-semibold font-mono">{secondsToHMS(remaining)}</div>
            <p className="text-gray-500 text-sm">Remaining Time</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-semibold font-mono">
                {secondsToHMS(balance?.balanceSeconds ?? 0)}
              </div>
              <p className="text-gray-500 text-sm">Balance Time</p>
            </div>
            <div>
              <div className="text-2xl font-semibold font-mono">{balance?.points}</div>
              <p className="text-gray-500 text-sm">Points</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {remaining > 0 ? (
          <button
            className="w-full bg-purple-600 hover:bg-purple-400 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
            onClick={handleResume}
          >
            Resume
          </button>
        ) : (
          <button
            className="w-full bg-purple-600 hover:bg-purple-400 disabled:bg-purple-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
            onClick={handleUseTime}
            disabled={(balance?.balanceSeconds ?? 0) === 0 || isUsingTime}
          >
            {isUsingTime && <LucideLoader className="animate-spin size-4" />}
            Use Time
          </button>
        )}
        <button
          className="w-full bg-red-600 hover:bg-red-400 disabled:bg-red-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
          onClick={handleSaveAndLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut && <LucideLoader className="animate-spin size-4" />}
          Save & Logout
        </button>
      </div>
    </div>
  )
}
