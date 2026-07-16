interface Props {
  value: number
}

export const Progress = ({ value }: Props): React.JSX.Element => {
  const progress = Math.min(Math.max(value, 0), 100)

  return (
    <div className="w-full h-3 overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-purple-600 transition-all duration-300 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
