import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { AppConfig } from './common/types/app.type'

const userConfigPath = path.join(app.getPath('userData'), 'config.json')
const defaultConfigPath = path.join(__dirname, '../../resources/config.json')

if (!fs.existsSync(userConfigPath)) {
  fs.copyFileSync(defaultConfigPath, userConfigPath)
}

const config: AppConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'))

export default config
