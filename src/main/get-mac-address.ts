import os from 'os'

export function getMacAddress(): string | null {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    const netInterface = nets[name]
    if (!netInterface) continue
    for (const net of netInterface) {
      if (!net.internal && net.family === 'IPv4') {
        return net.mac
      }
    }
  }
  return null
}
