import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { AppConfig } from '../common/types/app.type'
import { v4 as uuidv4 } from 'uuid'

const userConfigPath = path.join(app.getPath('userData'), 'config.json')

const defaultConfigPath = app.isPackaged
  ? path.join(process.resourcesPath, 'config.json')
  : path.join(process.cwd(), 'resources/config.json')

if (!fs.existsSync(userConfigPath)) {
  const defaultConfig: AppConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'))
  defaultConfig.deviceId = uuidv4()
  fs.writeFileSync(userConfigPath, JSON.stringify(defaultConfig, null, 2))
}

const config: AppConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'))

export default config
