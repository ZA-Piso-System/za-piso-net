import { useEffect, useState } from 'react'
import { AppConfig } from 'src/common/types/app.type'

export const useAppConfig = (): AppConfig | null => {
  const [config, setConfig] = useState<AppConfig | null>(null)

  useEffect(() => {
    const loadConfig = async (): Promise<void> => {
      const cfg = await window.electron.ipcRenderer.invoke('get-app-config')
      setConfig(cfg)
    }
    loadConfig()
  }, [])

  return config
}
