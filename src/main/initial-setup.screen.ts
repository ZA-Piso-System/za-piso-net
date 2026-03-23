import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'

let win: BrowserWindow | null = null

export const createInitialSetupWindow = (): void => {
  if (win) return

  win = new BrowserWindow({
    autoHideMenuBar: true,
    movable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: false
    }
  })

  win.setAlwaysOnTop(true, 'screen-saver')

  win.on('ready-to-show', () => {
    if (!win) return
    win.show()
  })

  if (process.env.NODE_ENV !== 'development') {
    win.on('close', (e) => e.preventDefault())
  }

  win.on('closed', () => {
    win = null
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/initialsetupscreen/index.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/initialsetupscreen/index.html'))
  }
}

export const closeInitialSetupWindow = (): void => {
  if (win) {
    win.destroy()
  }
}
