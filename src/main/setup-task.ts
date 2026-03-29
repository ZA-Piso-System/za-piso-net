import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

export const setupTask = (): void => {
  if (process.platform !== 'win32') return

  const vbsPath = path.join(process.resourcesPath, 'start.vbs')
  const taskName = 'ZATask'

  if (!fs.existsSync(vbsPath)) {
    console.error('start.vbs not found:', vbsPath)
    return
  }

  exec(`schtasks /query /tn "${taskName}"`, { windowsHide: true }, (err, stdout) => {
    if (!err && stdout.includes(taskName)) return

    const createCmd = `schtasks /create /tn "${taskName}" /tr "C:\\Windows\\System32\\wscript.exe \\"${vbsPath}\\"" /sc onlogon /rl highest /f`

    exec(createCmd, { windowsHide: true }, (err) => {
      if (err) {
        console.error('Failed to create task:', err)
        return
      }
    })
  })
}
