import { electronClient } from '@better-auth/electron/client'
import { storage } from '@better-auth/electron/storage'
import { createAuthClient } from 'better-auth/client'
import { getAppConfig } from '../config/app.config'

export const authClient = createAuthClient({
  baseURL: `${getAppConfig()?.apiUrl}/auth`,
  plugins: [
    electronClient({
      signInURL: '',
      protocol: {
        scheme: 'com.electron.app'
      },
      storage: storage()
    })
  ]
})
