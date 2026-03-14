import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { closeTimerScreenWindow } from './timerscreen'

let lockScreenWindow: BrowserWindow | null = null

export const createLockScreenWindow = (): void => {
  lockScreenWindow = new BrowserWindow({
    kiosk: process.env.NODE_ENV !== 'development',
    alwaysOnTop: true,
    autoHideMenuBar: true,
    fullscreen: true,
    frame: false,
    movable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: false
    }
  })

  lockScreenWindow.on('ready-to-show', () => {
    if (!lockScreenWindow) return
    lockScreenWindow.show()
  })

  if (process.env.NODE_ENV !== 'development') {
    lockScreenWindow.on('close', (e) => e.preventDefault())
  }

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

  closeTimerScreenWindow()
}

export const closeLockScreenWindow = (): void => {
  if (lockScreenWindow) {
    lockScreenWindow.destroy()
  }
}
