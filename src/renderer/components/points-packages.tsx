import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PaginatedResponse } from 'src/common/types/pagination.type'
import { PointsPackage } from 'src/common/types/points-package.type'

interface Props {
  onSelectCallback: (id: string) => void
  onCloseCallback: () => void
}

export const PointsPackages = ({ onSelectCallback, onCloseCallback }: Props): React.JSX.Element => {
  const [pointsPackages, setPointsPackages] = useState<PaginatedResponse<PointsPackage> | null>(
    null
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    getPointsPackages()
  }, [])

  const getPointsPackages = async (): Promise<void> => {
    const result = await window.electron.ipcRenderer.invoke('fetch-points-packages')
    setPointsPackages(result)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative w-3xl bg-white flex flex-col gap-4 rounded-md p-4">
        <div>
          <h2 className="text-3xl font-bold font-[AudioWide]">Points Packages</h2>
          <p className="text-gray-500">Redeem points for PC time</p>
        </div>
        <button
          className="absolute top-4 right-4 hover:bg-gray-200 p-2 rounded-md"
          onClick={onCloseCallback}
        >
          <XIcon />
        </button>
        <div className="grid grid-cols-3 gap-4">
          {pointsPackages?.items.map((pointsPackage) => (
            <div
              key={pointsPackage.id}
              onClick={() => onSelectCallback(pointsPackage.id)}
              className="p-3 border border-gray-200 rounded-md cursor-pointer transition-all hover:shadow-md hover:border-purple-500 active:scale-[0.98] bg-white flex flex-col gap-1"
            >
              <div className="font-medium text-gray-800">{pointsPackage.name}</div>
              <div className="text-purple-600 font-semibold text-sm">
                {pointsPackage.pointsCost} Points
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
