import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { AppConfig } from '../common/types/app.type'
import { v4 as uuidv4 } from 'uuid'

const configPath = app.isPackaged
  ? path.join(process.resourcesPath, 'config.json')
  : path.join(process.cwd(), 'resources/config.json')

const config: AppConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))

if (!config.deviceId) {
  config.deviceId = uuidv4()
}

export default config
