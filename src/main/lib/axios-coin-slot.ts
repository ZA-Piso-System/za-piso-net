import axios from 'axios'
import { getAppConfig } from '../config/app.config'

const axiosCoinSlot = axios.create()

axiosCoinSlot.interceptors.request.use(async (config) => {
  const appConfig = getAppConfig()
  config.baseURL = appConfig?.coinSlotUrl
  return config
})

export default axiosCoinSlot
