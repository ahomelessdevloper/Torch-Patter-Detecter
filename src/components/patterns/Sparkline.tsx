interface SparklineProps {
  data: number[]
  bullish?: boolean
  bearish?: boolean
  height?: number
}

export function Sparkline({ data, bullish, bearish, height = 40 }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 100
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  const color = bullish ? '#f59e0b' : bearish ? '#f43f5e' : '#7a7a8c'

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polyline
        fill={`${color}18`}
        stroke="none"
        points={`0,${height} ${points} ${w},${height}`}
      />
    </svg>
  )
}