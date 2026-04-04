import { secondsToHMS } from '@renderer/utils/number.util'
import { EyeIcon, EyeOffIcon, LucideLoader } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  onSwitchForm: () => void
  onLoginCallback: () => void
}

export const LoginForm = ({ onSwitchForm, onLoginCallback }: Props): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [remaining, setRemaining] = useState<number>(0)

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

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

  const handleLogin = async (): Promise<void> => {
    setLoading(true)
    await window.electron.ipcRenderer.invoke('login', { email, password })
    onLoginCallback()
    setLoading(false)
  }

  const handleResume = (): void => {
    window.electron.ipcRenderer.invoke('resume-time')
  }

  return (
    <div className="bg-white flex flex-col gap-4 p-4 rounded-md">
      <div>
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <div className="text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <button className="underline underline-offset-4" onClick={onSwitchForm}>
            Register
          </button>
        </div>
      </div>
      <input
        className="border border-gray-500 rounded-md px-2 py-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="text"
      />
      <div className="relative">
        <input
          className="w-full border border-gray-500 rounded-md px-2 py-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type={isPasswordVisible ? 'text' : 'password'}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      <button
        className="w-full bg-purple-600 hover:bg-purple-400 disabled:bg-purple-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading && <LucideLoader className="animate-spin size-4" />}
        Login
      </button>
      {remaining > 0 && (
        <div className="flex flex-col gap-4">
          <hr />
          <div className="flex flex-col justify-center items-center p-2">
            <div className="text-2xl font-semibold font-mono">{secondsToHMS(remaining)}</div>
            <p className="text-gray-500 text-sm">Remaining Time</p>
          </div>
          <button
            className="w-full bg-purple-600 hover:bg-purple-400 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
            onClick={handleResume}
          >
            Resume
          </button>
        </div>
      )}
    </div>
  )
}
