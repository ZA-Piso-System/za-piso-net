import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut, ipcMain, protocol } from 'electron'
import fs from 'fs'
import path from 'path'
import { getAppConfig, saveAppConfig } from './config/app.config'
import { getDeviceConfig, saveDeviceConfig } from './config/device.config'
import { getMacAddress } from './get-mac-address'
import { createInitialSetupWindow } from './initial-setup.screen'
import { authClient } from './lib/auth'
import { createLockScreenWindow } from './lockscreen'
import { registerDevice } from './services/device.service'
import { setupTask } from './setup-task'
import { initializeWebsocket } from './websocket'
import { fetchBalance, stopTime, useTime } from './services/me.service'
import { createTimerScreenWindow } from './timerscreen'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.za.piso-net')

  protocol.registerFileProtocol('app', (request, callback) => {
    const url = new URL(request.url)
    const fileName = path.basename(url.pathname)
    const imagesDir = path.join(app.getPath('userData'), 'images')
    const filePath = path.join(imagesDir, fileName)
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath)
    }
    callback(filePath)
  })

  globalShortcut.register('F11', () => {})

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const appConfig = getAppConfig()
  const deviceConfig = getDeviceConfig()

  ipcMain.handle('get-app-version', () => app.getVersion())
  ipcMain.handle('get-app-config', () => appConfig)
  ipcMain.handle('get-device-config', () => deviceConfig)

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('get-mac-address', () => getMacAddress())

  ipcMain.handle('get-session', async () => {
    const result = await authClient.getSession()
    return result.data
  })

  ipcMain.handle(
    'login',
    async (_, formData: { emailOrUsername: string; password: string }): Promise<void> => {
      if (formData.emailOrUsername.includes('@')) {
        await authClient.signIn.email({
          email: formData.emailOrUsername,
          password: formData.password
        })
      } else {
        await authClient.signIn.username({
          username: formData.emailOrUsername,
          password: formData.password
        })
      }
    }
  )

  ipcMain.handle(
    'register',
    async (
      _,
      formData: { name: string; email: string; password: string; username: string }
    ): Promise<void> => {
      await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username
      })
    }
  )

  ipcMain.handle('get-balance', async () => {
    return await fetchBalance()
  })

  ipcMain.handle('resume-time', async () => {
    createTimerScreenWindow()
  })

  ipcMain.handle('use-time', async () => {
    if (deviceConfig) {
      await useTime(deviceConfig.id)
    }
  })

  ipcMain.handle('exit', async () => {
    createLockScreenWindow()
  })

  ipcMain.handle('logout', async () => {
    await authClient.signOut()
  })

  ipcMain.handle('save-and-logout', async () => {
    if (deviceConfig) {
      await stopTime(deviceConfig.id)
    }
    await authClient.signOut()
  })

  ipcMain.handle(
    'register-device',
    async (
      _,
      formData: {
        apiUrl: string
        wsUrl: string
        macAddress: string
        token: string
        appName: string
      }
    ) => {
      saveAppConfig({ apiUrl: formData.apiUrl, wsUrl: formData.wsUrl, appName: formData.appName })

      setTimeout(async () => {
        const macAddress = getMacAddress()
        if (!macAddress) return

        const result = await registerDevice({
          macAddress,
          registrationToken: formData.token
        })

        saveDeviceConfig(result.data)
        app.relaunch()
        app.exit(0)
      }, 1_000)
    }
  )
  ipcMain.handle('get-images', () => {
    const imagesDir = path.join(app.getPath('userData'), 'images')
    if (!fs.existsSync(imagesDir)) return []

    const files = fs
      .readdirSync(imagesDir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map((f) => `app://images/${encodeURIComponent(f)}`)
    return files
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createLockScreenWindow()
  })

  setupTask()

  if (!appConfig || !deviceConfig) {
    createInitialSetupWindow()
    return
  }

  createLockScreenWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
initializeWebsocket()
