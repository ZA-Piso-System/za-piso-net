import axios from 'axios'
import { getAppConfig } from '../config/app.config'

const axiosInstance = axios.create({
  baseURL: getAppConfig()?.apiUrl,
  withCredentials: true
})

export default axiosInstance
