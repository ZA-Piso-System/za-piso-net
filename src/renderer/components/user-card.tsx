import { PointsPackages } from '@renderer/components/points-packages'
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

  const [showPointsPackage, setShowPointsPackage] = useState<boolean>(false)

  const [isFetchingBalance, setIsFetchingBalance] = useState<boolean>(false)
  const [isUsingTime, setIsUsingTime] = useState<boolean>(false)
  const [isRedeemingPoints, setIsRedeemingPoints] = useState<boolean>(false)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const [isSavingAndLoggingOut, setIsSavingAndLoggingOut] = useState<boolean>(false)

  const isLoading =
    isFetchingBalance || isUsingTime || isRedeemingPoints || isLoggingOut || isSavingAndLoggingOut

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
    setIsFetchingBalance(true)
    const result = await window.electron.ipcRenderer.invoke('get-balance')
    setBalance(result)
    setIsFetchingBalance(false)
  }

  const handleResume = (): void => {
    window.electron.ipcRenderer.invoke('resume-time')
  }

  const handleUseTime = (): void => {
    setIsUsingTime(true)
    window.electron.ipcRenderer.invoke('use-time')
    setTimeout(() => {
      setIsUsingTime(false)
      loadBalance()
    }, 1_000)
  }

  const handleRedeemPointsPackage = (id: string): void => {
    setIsRedeemingPoints(true)
    setShowPointsPackage(false)
    window.electron.ipcRenderer.invoke('redeem-points-package', id)
    setTimeout(() => {
      setIsRedeemingPoints(false)
      loadBalance()
    }, 1_000)
  }

  const handleLogout = (): void => {
    setIsLoggingOut(true)
    window.electron.ipcRenderer.invoke('logout')
    setTimeout(() => onLogoutCallback(), 1_000)
  }

  const handleSaveAndLogout = (): void => {
    setIsSavingAndLoggingOut(true)
    window.electron.ipcRenderer.invoke('save-and-logout')
    setTimeout(() => onLogoutCallback(), 1_000)
  }

  return (
    <div className="bg-white flex flex-col gap-4 p-4 rounded-md">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Hi, {user.name} 👋</h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-semibold font-mono">
              {secondsToHMS(balance?.balanceSeconds ?? 0)}
            </div>
            <p className="text-gray-500 text-sm">Balance Time</p>
          </div>
          <div>
            <div className="text-2xl font-semibold font-mono">{balance?.points ?? 0}</div>
            <p className="text-gray-500 text-sm">Points</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            className="w-full bg-purple-600 hover:bg-purple-400 disabled:bg-purple-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
            onClick={handleUseTime}
            disabled={isLoading || (balance?.balanceSeconds ?? 0) === 0}
          >
            {isUsingTime && <LucideLoader className="animate-spin size-4" />}
            Use Time
          </button>
          <button
            className="w-full border border-purple-600 text-purple-600 hover:bg-purple-100 disabled:bg-purple-50 flex justify-center items-center gap-2 text-sm rounded-md px-4 py-2"
            onClick={() => setShowPointsPackage((prev) => !prev)}
            disabled={isLoading || (balance?.points ?? 0) === 0}
          >
            {isRedeemingPoints && <LucideLoader className="animate-spin size-4" />}
            Use Points
          </button>
        </div>
        <button
          className="w-full bg-gray-600 hover:bg-gray-400 disabled:bg-gray-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoggingOut && <LucideLoader className="animate-spin size-4" />}
          Logout
        </button>
        <button
          className="w-full bg-green-600 hover:bg-green-400 disabled:bg-green-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
          onClick={handleSaveAndLogout}
          disabled={isLoading}
        >
          {isSavingAndLoggingOut && <LucideLoader className="animate-spin size-4" />}
          Save & Logout
        </button>
        {remaining > 0 && (
          <div className="flex flex-col gap-4">
            <hr />
            <div className="flex flex-col justify-center items-center p-2">
              <div className="text-2xl font-semibold font-mono">{secondsToHMS(remaining)}</div>
              <p className="text-gray-500 text-sm">Remaining Time</p>
            </div>
            <button
              className="w-full bg-purple-600 hover:bg-purple-400 disabled:bg-purple-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
              onClick={handleResume}
              disabled={isLoading}
            >
              Resume
            </button>
          </div>
        )}
      </div>
      {showPointsPackage && (
        <PointsPackages
          onSelectCallback={handleRedeemPointsPackage}
          onCloseCallback={() => setShowPointsPackage(false)}
        />
      )}
    </div>
  )
}
