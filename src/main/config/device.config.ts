import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { Device } from '../../common/types/device.type'

const userConfigPath = path.join(app.getPath('userData'), 'device-config.json')

export const getDeviceConfig = (): Device | null => {
  return fs.existsSync(userConfigPath) ? JSON.parse(fs.readFileSync(userConfigPath, 'utf8')) : null
}

export const saveDeviceConfig = (newValue: Device): void => {
  fs.writeFileSync(userConfigPath, JSON.stringify(newValue, null, 2))
}
