import { Device, RegisterDevice } from '../../common/types/device.type'
import { MutationResponse } from '../../common/types/response.type'
import axiosInstance from '../lib/axios'

export const registerDevice = async (
  formData: RegisterDevice
): Promise<MutationResponse<Device>> => {
  const response = await axiosInstance.post('/devices/register', formData)
  return response.data
}
