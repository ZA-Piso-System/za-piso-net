import { Status } from './status.type'

export interface Client {
  deviceId: string
  pcNo: number
  status: Status
  startAt: number | null
  remainingSeconds: number
  lastSeen: number
}
