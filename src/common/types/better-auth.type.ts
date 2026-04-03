import { authClient } from '../../main/lib/auth'

export type Session = typeof authClient.$Infer.Session
