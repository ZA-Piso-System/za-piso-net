import axios from 'axios'
import { getAppConfig } from '../config/app.config'
import { authClient } from './auth'

const axiosInstance = axios.create({
  withCredentials: true
})

axiosInstance.interceptors.request.use(async (config) => {
  const appConfig = getAppConfig()
  const session = await authClient.getSession()
  config.baseURL = appConfig?.apiUrl
  config.headers.Authorization = `Bearer ${session.data?.session.token}`
  return config
})

export default axiosInstance
