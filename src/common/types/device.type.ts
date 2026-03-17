export type Device = {
  id: string
  deviceNumber: number
  macAddress: string
  type: string
}

export type RegisterDevice = {
  macAddress: string
  registrationToken: string
}

export const DeviceStatus = {
  Pending: 'pending',
  Offline: 'offline',
  Idle: 'idle',
  Active: 'active'
} as const

export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus]
