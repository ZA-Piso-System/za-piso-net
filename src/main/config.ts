import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { AppConfig } from '../common/types/app.type'

const configPath = app.isPackaged
  ? path.join(process.resourcesPath, 'config.json') // production
  : path.join(process.cwd(), 'resources/config.json') // development

const config: AppConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))

export default config
