import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { closeLockScreenWindow } from './lockscreen'

let timerWindow: BrowserWindow | null = null

export const createTimerScreenWindow = (): void => {
  closeLockScreenWindow()

  const { width } = screen.getPrimaryDisplay().workAreaSize

  timerWindow = new BrowserWindow({
    width: 400,
    height: 200,
    x: width - 400,
    y: 0,
    autoHideMenuBar: true,
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

  timerWindow.on('ready-to-show', () => {
    if (!timerWindow) return
    timerWindow.show()

    // // TODO: pass correct time
    // startTimer(15)
  })

  timerWindow.on('close', (e) => e.preventDefault())

  timerWindow.on('closed', () => {
    timerWindow = null
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    timerWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/timerscreen/index.html`)
  } else {
    timerWindow.loadFile(join(__dirname, '../renderer/timerscreen/index.html'))
  }
}

export const closeTimerScreenWindow = (): void => {
  if (timerWindow) {
    timerWindow.destroy()
  }
}
