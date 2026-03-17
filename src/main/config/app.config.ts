import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { AppConfig } from '../../common/types/config.type'

const userConfigPath = path.join(app.getPath('userData'), 'app-config.json')

export const getAppConfig = (): AppConfig | null => {
  return fs.existsSync(userConfigPath) ? JSON.parse(fs.readFileSync(userConfigPath, 'utf8')) : null
}

export const saveAppConfig = (newValue: AppConfig): void => {
  fs.writeFileSync(userConfigPath, JSON.stringify(newValue, null, 2))
}
