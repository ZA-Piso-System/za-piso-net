const { spawn, exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const appName = 'za-piso-net.exe'
const appPath = path.join(path.dirname(process.execPath), '..', appName)

if (!fs.existsSync(appPath)) {
  console.error('App not found:', appPath)
  process.exit(1)
}

function isRunning(callback) {
  exec(`tasklist`, (err, stdout) => {
    if (err) return callback(false)
    callback(stdout.toLowerCase().includes(appName.toLowerCase()))
  })
}

function startApp() {
  console.log('Starting app...')

  const child = spawn(appPath, [], {
    detached: true,
    stdio: 'ignore'
  })

  child.unref()
}

setInterval(() => {
  isRunning((running) => {
    if (!running) {
      console.log('App not running. Restarting...')
      startApp()
    }
  })
}, 3000)

startApp()
