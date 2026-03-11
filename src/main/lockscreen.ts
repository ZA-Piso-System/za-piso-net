import { BrowserWindow } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'

let lockScreenWindow: BrowserWindow | null = null

export const createLockScreenWindow = (): void => {
  lockScreenWindow = new BrowserWindow({
    alwaysOnTop: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    fullscreen: true,
    frame: false,
    movable: false,
    resizable: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  lockScreenWindow.on('ready-to-show', () => {
    if (!lockScreenWindow) return
    lockScreenWindow.show()
  })

  lockScreenWindow.on('closed', () => {
    lockScreenWindow = null
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    lockScreenWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/lockscreen/index.html`)
  } else {
    lockScreenWindow.loadFile(join(__dirname, '../renderer/lockscreen/index.html'))
  }
}
