import dgram from 'node:dgram'

const DISCOVERY_PORT = 5001

export const discoverTimerServer = (timeout = 5000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4')

    // Listen for server reply
    socket.on('message', (_msg, rinfo) => {
      const serverIP = rinfo.address
      socket.close()
      resolve(serverIP)
    })

    socket.on('error', (err) => {
      socket.close()
      reject(err)
    })

    // Bind socket and broadcast discovery
    socket.bind(() => {
      socket.setBroadcast(true)
      const message = Buffer.from('DISCOVER_TIMER_SERVER')
      socket.send(message, 0, message.length, DISCOVERY_PORT, '255.255.255.255')
    })

    // Optional timeout
    setTimeout(() => {
      socket.close()
      reject(new Error('Timer server not found in local network'))
    }, timeout)
  })
}
