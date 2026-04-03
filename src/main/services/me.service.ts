import { BalanceResponse } from '../../common/types/user.type'
import axiosInstance from '../lib/axios'

export const fetchBalance = async (): Promise<BalanceResponse> => {
  const response = await axiosInstance.get('/user/me/balance')
  return response.data
}

export const useTime = async (id: string): Promise<unknown> => {
  const response = await axiosInstance.post('/user/me/use-time', { id })
  return response.data
}

export const stopTime = async (id: string): Promise<unknown> => {
  const response = await axiosInstance.post('/user/me/stop-time', { id })
  return response.data
}
