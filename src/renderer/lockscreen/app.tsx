import { LoginForm } from '@renderer/components/login-form'
import { RegisterForm } from '@renderer/components/register-form'
import { UserCard } from '@renderer/components/user-card'
import { useAppConfig } from '@renderer/hooks/useAppConfig'
import { useDeviceConfig } from '@renderer/hooks/useDeviceConfig'
import { secondsToHMS } from '@renderer/utils/number.util'
import { useEffect, useState } from 'react'
import { Session } from 'src/common/types/better-auth.type'

export default function App(): React.JSX.Element {
  const appConfig = useAppConfig()
  const deviceConfig = useDeviceConfig()

  const [session, setSession] = useState<Session | null>(null)

  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentForm, setCurrentForm] = useState<'login' | 'register'>('login')

  const [remaining, setRemaining] = useState<number>(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSession()
  }, [])

  useEffect(() => {
    const loadImages = async (): Promise<void> => {
      const imgs = await window.electron.ipcRenderer.invoke('get-images')
      setImages(imgs)
    }
    loadImages()
  }, [])

  useEffect(() => {
    if (images.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3) % images.length)
    }, 5_000)
    return () => clearInterval(interval)
  }, [images])

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'shutdown-update',
      (_event: unknown, ms: number): void => {
        setRemaining(ms)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const loadSession = async (): Promise<void> => {
    const newSession = await window.electron.ipcRenderer.invoke('get-session')
    setSession(newSession)
  }

  const visibleImages = images.slice(currentIndex, currentIndex + 3)

  return (
    <div className="h-screen grid grid-cols-4">
      {visibleImages.map((imageUrl, i) => (
        <img key={i} src={imageUrl} className="h-full object-cover" />
      ))}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-800 flex justify-center items-center">
        <h2 className="text-5xl text-white font-bold font-[Audiowide]">{appConfig?.appName}</h2>
        <div className="absolute bottom-10 w-full p-8">
          {!session?.user && currentForm === 'login' && (
            <LoginForm
              onSwitchForm={() => setCurrentForm('register')}
              onLoginCallback={() => {
                loadSession()
              }}
            />
          )}
          {!session?.user && currentForm === 'register' && (
            <RegisterForm
              onSwitchForm={() => setCurrentForm('login')}
              onRegisterCallback={() => {
                loadSession()
              }}
            />
          )}
          {session?.user && (
            <UserCard
              user={{
                name: session.user.name
              }}
              onLogoutCallback={() => {
                loadSession()
              }}
            />
          )}
        </div>
      </div>
      <div className="absolute top-10 right-10">
        <h1 className="text-8xl text-white font-bold font-[Audiowide]">
          {deviceConfig?.deviceNumber.toString().padStart(2, '0')}
        </h1>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 bg-black/50 text-white text-center p-4">
        <div className="font-bold uppercase">This pc will turn off in</div>
        <div className="text-3xl font-bold font-mono">{secondsToHMS(remaining)}</div>
      </div>
    </div>
  )
}
