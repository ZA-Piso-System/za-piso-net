import { PaginatedResponse } from '../../common/types/pagination.type'
import { PointsPackage } from '../../common/types/points-package.type'
import axiosInstance from '../lib/axios'

export const fetchPointsPackages = async (): Promise<PaginatedResponse<PointsPackage>> => {
  const response = await axiosInstance.get('/user/points-packages')
  return response.data
}
