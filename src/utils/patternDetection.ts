import type { Candle } from '../services/lighterApi'
import type { PatternName, PatternCategory, PatternBias } from '../data/candlePatterns'
import { buildPatternOverlay, type PatternOverlay } from './patternOverlay'
import { detectCandlestickPatterns } from './candlestickDetect'
import { DEFAULT_CHART_RESOLUTION, DEFAULT_CANDLE_COUNT } from '../constants/chart'

export type { PatternName, PatternBias } from '../data/candlePatterns'

export interface PatternResult {
  bias: PatternBias
  pattern: PatternName
  category: PatternCategory
  confidence: number
  currentPrice: number
  support: number
  resistance: number
  upsideTarget: number
  downsideTarget: number
  upsidePercent: number
  downsidePercent: number
  sparkline: number[]
  overlay: PatternOverlay
  resolution: string
  candleCount: number
  patternCandleIdx?: number
}

function findPeaks(vals: number[]): number[] {
  const peaks: number[] = []
  for (let i = 2; i < vals.length - 2; i++) {
    if (vals[i] > vals[i - 1] && vals[i] > vals[i - 2] && vals[i] >= vals[i + 1] && vals[i] >= vals[i + 2]) peaks.push(i)
  }
  return peaks
}

function findTroughs(vals: number[]): number[] {
  const troughs: number[] = []
  for (let i = 2; i < vals.length - 2; i++) {
    if (vals[i] < vals[i - 1] && vals[i] < vals[i - 2] && vals[i] <= vals[i + 1] && vals[i] <= vals[i + 2]) troughs.push(i)
  }
  return troughs
}

function pct(from: number, to: number) {
  return ((to - from) / from) * 100
}

interface ChartHit {
  pattern: PatternName
  bias: PatternBias
  confidence: number
}

function detectChartPattern(
  closes: number[],
  _highs: number[],
  _lows: number[],
  current: number,
  support: number,
  resistance: number,
  range: number,
): ChartHit {
  const peaks = findPeaks(closes)
  const troughs = findTroughs(closes)
  const recentHighs = peaks.slice(-3).map((i) => closes[i])
  const recentLows = troughs.slice(-3).map((i) => closes[i])
  const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, closes.length)
  const sma10 = closes.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, closes.length)
  const momentum = pct(closes[closes.length - 10] || closes[0], current)
  const lastThird = closes.slice(-Math.floor(closes.length / 3))
  const highTrend = lastThird[lastThird.length - 1] - lastThird[0]
  const lowsRising = recentLows.length >= 2 && recentLows[recentLows.length - 1] > recentLows[0] * 1.002
  const highsFalling = recentHighs.length >= 2 && recentHighs[recentHighs.length - 1] < recentHighs[0] * 0.998

  if (recentLows.length >= 2) {
    const [a, b] = recentLows.slice(-2)
    const diff = Math.abs(a - b) / a
    if (diff < 0.02 && current > Math.max(a, b) * 1.01)
      return { pattern: 'Double Bottom', bias: 'bullish', confidence: 78 - diff * 200 }
  }
  if (recentHighs.length >= 2) {
    const [a, b] = recentHighs.slice(-2)
    const diff = Math.abs(a - b) / a
    if (diff < 0.02 && current < Math.min(a, b) * 0.99)
      return { pattern: 'Double Top', bias: 'bearish', confidence: 76 - diff * 200 }
  }
  if (peaks.length >= 3) {
    const p = peaks.slice(-3).map((i) => closes[i])
    if (p[1] > p[0] * 1.01 && p[1] > p[2] * 1.01 && current < p[2])
      return { pattern: 'Head & Shoulders', bias: 'bearish', confidence: 74 }
    if (p[1] < p[0] * 0.99 && p[1] < p[2] * 0.99 && current > p[2])
      return { pattern: 'Inverse Head & Shoulders', bias: 'bullish', confidence: 75 }
  }
  if (momentum > 3 && highTrend < 0 && current > sma10)
    return { pattern: 'Bull Flag', bias: 'bullish', confidence: 72 }
  if (momentum < -3 && highTrend > 0 && current < sma10)
    return { pattern: 'Bear Flag', bias: 'bearish', confidence: 71 }
  if (lowsRising && range > 0 && (resistance - current) / range < 0.15)
    return { pattern: 'Ascending Triangle', bias: 'bullish', confidence: 73 }
  if (highsFalling && range > 0 && (current - support) / range < 0.15)
    return { pattern: 'Descending Triangle', bias: 'bearish', confidence: 72 }
  if (sma10 > sma20 && momentum > 2)
    return { pattern: 'Cup & Handle', bias: 'bullish', confidence: 71 }
  if (current > resistance * 0.998 && momentum > 1)
    return { pattern: 'Breakout Up', bias: 'bullish', confidence: 70 }
  if (current < support * 1.002 && momentum < -1)
    return { pattern: 'Breakdown', bias: 'bearish', confidence: 70 }

  return {
    pattern: 'Consolidation',
    bias: momentum > 0.5 ? 'bullish' : momentum < -0.5 ? 'bearish' : 'neutral',
    confidence: 45 + Math.min(15, Math.abs(momentum) * 2),
  }
}

export function detectPattern(
  candles: Candle[],
  fallbackPrice: number,
  resolution: string = DEFAULT_CHART_RESOLUTION,
): PatternResult {
  if (candles.length < 10) return neutralResult(fallbackPrice, resolution)

  const closes = candles.map((c) => c.c)
  const highs = candles.map((c) => c.h)
  const lows = candles.map((c) => c.l)
  const current = closes[closes.length - 1]
  const support = Math.min(...lows.slice(-20))
  const resistance = Math.max(...highs.slice(-20))
  const range = resistance - support

  const candleHit = detectCandlestickPatterns(candles)
  const chartHit = detectChartPattern(closes, highs, lows, current, support, resistance, range)

  const useCandle = candleHit && candleHit.confidence >= chartHit.confidence
  const hit = useCandle
    ? { pattern: candleHit.name as PatternName, bias: candleHit.bias, confidence: candleHit.confidence, category: 'candlestick' as const, patternCandleIdx: candleHit.candleIdx }
    : { ...chartHit, category: 'chart' as const, patternCandleIdx: undefined }

  const confidence = Math.min(92, Math.max(40, Math.round(hit.confidence)))
  const measuredMove = range > 0 ? range : current * 0.04

  let upsideTarget: number
  let downsideTarget: number
  if (hit.bias === 'bullish') {
    upsideTarget = resistance + measuredMove * 0.8
    downsideTarget = support
  } else if (hit.bias === 'bearish') {
    upsideTarget = resistance
    downsideTarget = support - measuredMove * 0.8
  } else {
    upsideTarget = resistance + measuredMove * 0.4
    downsideTarget = support - measuredMove * 0.4
  }

  return {
    bias: hit.bias,
    pattern: hit.pattern,
    category: hit.category,
    confidence,
    currentPrice: current,
    support,
    resistance,
    upsideTarget,
    downsideTarget,
    upsidePercent: pct(current, upsideTarget),
    downsidePercent: pct(current, downsideTarget),
    sparkline: closes.slice(-24),
    overlay: buildPatternOverlay(candles, hit.pattern, hit.bias, support, resistance, hit.patternCandleIdx),
    resolution,
    candleCount: candles.length,
    patternCandleIdx: hit.patternCandleIdx,
  }
}

function neutralResult(price: number, resolution: string = DEFAULT_CHART_RESOLUTION): PatternResult {
  const s = price * 0.96
  const r = price * 1.04
  const synthetic: Candle[] = Array.from({ length: 30 }, (_, i) => {
    const c = price * (1 + Math.sin(i * 0.3) * 0.02)
    return { t: i, o: c, h: c * 1.005, l: c * 0.995, c }
  })
  return {
    bias: 'neutral',
    pattern: 'Consolidation',
    category: 'chart',
    confidence: 40,
    currentPrice: price,
    support: s,
    resistance: r,
    upsideTarget: r,
    downsideTarget: s,
    upsidePercent: 4,
    downsidePercent: -4,
    sparkline: synthetic.map((c) => c.c),
    overlay: buildPatternOverlay(synthetic, 'Consolidation', 'neutral', s, r),
    resolution,
    candleCount: DEFAULT_CANDLE_COUNT,
  }
}