import axios from 'axios'
import { getAppConfig } from '../config/app.config'

const axiosInstance = axios.create({
  withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
  const appConfig = getAppConfig()
  config.baseURL = appConfig?.apiUrl
  return config
})

export default axiosInstance
