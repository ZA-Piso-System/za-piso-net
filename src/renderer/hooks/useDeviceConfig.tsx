import { useEffect, useState } from 'react'
import { Device } from 'src/common/types/device.type'

export const useDeviceConfig = (): Device | null => {
  const [config, setConfig] = useState<Device | null>(null)

  useEffect(() => {
    const loadConfig = async (): Promise<void> => {
      const cfg = await window.electron.ipcRenderer.invoke('get-device-config')
      setConfig(cfg)
    }
    loadConfig()
  }, [])

  return config
}
