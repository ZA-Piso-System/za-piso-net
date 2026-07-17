import { MINUTES_PER_PESO } from '@common/constants/app.constant'
import { QueryKey } from '@common/types/query-key.type'
import { CoinCounter } from '@renderer/components/coin-counter'
import { Progress } from '@renderer/components/progress'
import { secondsToHMS } from '@renderer/utils/number.util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect } from 'react'

const COUNTDOWN = 30
const COOLDOWN = 5

interface Props {
  user: {
    name: string
  }
  setShowInsertCoin: Dispatch<SetStateAction<boolean>>
  countdown: number
  setCountdown: Dispatch<SetStateAction<number>>
  cooldown: number
  setCooldown: Dispatch<SetStateAction<number>>
  onComplete: () => void
}

export const TopUp = ({
  user,
  setShowInsertCoin,
  countdown,
  setCountdown,
  cooldown,
  setCooldown,
  onComplete
}: Props): React.JSX.Element => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    initialData: { total: 0 },
    queryKey: [QueryKey.CoinSlots],
    queryFn: () => window.electron.ipcRenderer.invoke('fetch-total-inserted-coins'),
    refetchInterval: 1_000
  })

  const insertCoinDoneMutation = useMutation({
    mutationFn: () => window.electron.ipcRenderer.invoke('insert-coin-done'),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.resetQueries({ queryKey: [QueryKey.CoinSlots] })
      }, 2_000)
      onComplete()
    }
  })

  useEffect(() => {
    const total = data?.total ?? 0
    if (total > 0) {
      setCountdown(COUNTDOWN)
      setCooldown(COOLDOWN)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.total])

  const totalDuration = secondsToHMS((data.total ?? 0) * MINUTES_PER_PESO * 60)

  const handleClose = (): void => {
    insertCoinDoneMutation.mutate()
    setShowInsertCoin(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative w-3xl bg-white flex flex-col gap-4 rounded-md p-4">
        <h1>Top Up for {user?.name}</h1>
        <p>Ihulog ang coins para madagdagan ang time.</p>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-1 text-4xl font-bold">
            ₱<CoinCounter totalCoins={data?.total ?? 0} />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{totalDuration}</div>
            <div className="text-sm text-muted-foreground">Total Duration</div>
          </div>
        </div>
        <Progress value={(countdown / COUNTDOWN) * 100} />
        <button
          className="w-full border border-purple-600 text-purple-600 hover:bg-purple-100 disabled:bg-purple-50 flex justify-center items-center gap-2 text-sm rounded-md px-4 py-2"
          onClick={handleClose}
          disabled={cooldown > 0}
        >
          Done
          {cooldown > 0 && <span>({cooldown}s)</span>}
        </button>
      </div>
    </div>
  )
}
