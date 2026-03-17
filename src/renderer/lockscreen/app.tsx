import { useDeviceConfig } from '@renderer/hooks/useDeviceConfig'

export default function App(): React.JSX.Element {
  const config = useDeviceConfig()

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <div className="absolute top-10 right-10">
        <h1 className="text-8xl text-purple-500 font-bold font-mono">
          {config?.deviceNumber.toString().padStart(2, '0')}
        </h1>
      </div>
      <div className="text-5xl text-purple-500">ZA Pisonet</div>
    </div>
  )
}
