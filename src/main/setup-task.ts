import { exec } from 'child_process'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export const setupTask = (): void => {
  if (process.platform !== 'win32') return

  const flagFile = path.join(app.getPath('userData'), 'task.flag')

  if (fs.existsSync(flagFile)) return

  const appPath = path.join(process.execPath)
  const taskName = 'ZATask'

  exec(`schtasks /query /tn "${taskName}"`, { windowsHide: true }, (err, stdout) => {
    if (!err && stdout.includes(taskName)) {
      fs.writeFileSync(flagFile, 'done')
      return
    }

    const createCmd = `schtasks /create /tn "${taskName}" /tr '"${appPath}"' /sc onlogon /rl highest /f`
    exec(createCmd, { windowsHide: true }, (err) => {
      if (err) return
      fs.writeFileSync(flagFile, 'done')
    })
  })
}
