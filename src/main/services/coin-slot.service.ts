import axiosCoinSlot from '../lib/axios-coin-slot'

type TotalCoin = {
  total: number
}

export const fetchTotalInsertedCoins = async (): Promise<TotalCoin> => {
  const response = await axiosCoinSlot.get('/total-inserted-coins')
  return response.data
}

export const insertCoin = async (id: string, type: 'device' | 'user'): Promise<void> => {
  const response = await axiosCoinSlot.post(`/${id}/insert-coin`, {
    type
  })
  return response.data
}

export const insertCoinDone = async (id: string): Promise<void> => {
  const response = await axiosCoinSlot.post(`/${id}/done`)
  return response.data
}
