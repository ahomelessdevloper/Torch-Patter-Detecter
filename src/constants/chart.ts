export type ChartResolution = '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d'

export const RESOLUTION_MINUTES: Record<ChartResolution, number> = {
  '5m': 5,
  '15m': 15,
  '30m': 30,
  '1h': 60,
  '4h': 240,
  '12h': 720,
  '1d': 1440,
}

export const CHART_RESOLUTION_OPTIONS: ChartResolution[] = ['15m', '30m', '1h', '4h', '12h', '1d']
export const CANDLE_COUNT_OPTIONS = [60, 120, 180] as const
export type CandleCount = (typeof CANDLE_COUNT_OPTIONS)[number]

export const DEFAULT_CHART_RESOLUTION: ChartResolution = '4h'
export const DEFAULT_CANDLE_COUNT: CandleCount = 60

export const CHART_RESOLUTION = DEFAULT_CHART_RESOLUTION
export const CHART_RESOLUTION_MINUTES = RESOLUTION_MINUTES[DEFAULT_CHART_RESOLUTION]
export const CHART_CANDLE_COUNT = DEFAULT_CANDLE_COUNT

export function getResolutionMinutes(resolution: ChartResolution | string): number {
  return RESOLUTION_MINUTES[resolution as ChartResolution] ?? 240
}

export function getMarketSpanLabel(
  candleCount: number = DEFAULT_CANDLE_COUNT,
  resolution: ChartResolution | string = DEFAULT_CHART_RESOLUTION,
): string {
  const totalMinutes = candleCount * getResolutionMinutes(resolution)
  if (totalMinutes < 60) return `${totalMinutes}min`
  if (totalMinutes < 1440) return `${totalMinutes / 60}hr`
  const days = totalMinutes / 1440
  return days % 1 === 0 ? `${days}d` : `${days.toFixed(1)}d`
}

export function getTimeframeLabel(
  resolution: ChartResolution | string = DEFAULT_CHART_RESOLUTION,
  candleCount: number = DEFAULT_CANDLE_COUNT,
): string {
  return `${resolution} · ${candleCount} candles · ${getMarketSpanLabel(candleCount, resolution)} market`
}