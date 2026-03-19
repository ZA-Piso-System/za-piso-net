import { useDeviceConfig } from '@renderer/hooks/useDeviceConfig'
import { useEffect, useState } from 'react'

export default function App(): React.JSX.Element {
  const config = useDeviceConfig()

  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [remaining, setRemaining] = useState<number>(0)

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

  const visibleImages = images.slice(currentIndex, currentIndex + 3)

  return (
    <div className="h-screen grid grid-cols-4">
      {visibleImages.map((imageUrl, i) => (
        <img key={i} src={imageUrl} className="h-full object-cover" />
      ))}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-800 flex justify-center items-center">
        <h2 className="text-5xl text-white font-bold font-[Audiowide]">ZA Pisonet</h2>
      </div>
      <div className="absolute top-10 right-10">
        <h1 className="text-8xl text-white font-bold font-[Audiowide]">
          {config?.deviceNumber.toString().padStart(2, '0')}
        </h1>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 bg-black/50 text-white text-center p-4">
        <div className="font-bold uppercase">This pc will turn off in</div>
        <div className="text-3xl font-bold font-mono">{secondsToHMS()}</div>
      </div>
    </div>
  )
}
