import type { Candle } from '../services/lighterApi'
import type { PatternName, PatternBias } from '../data/candlePatterns'

export interface OverlayPoint { idx: number; price: number }

export interface OverlayLine {
  from: OverlayPoint
  to: OverlayPoint
  color: string
  dashed?: boolean
}

export interface OverlayMarker {
  idx: number
  price: number
  color: string
}

export interface PatternOverlay {
  lines: OverlayLine[]
  markers: OverlayMarker[]
  highlightZone?: { startIdx: number; endIdx: number; color: string }
}

const BULL = '#f59e0b'
const BEAR = '#f43f5e'
const NEUTRAL = '#8b8b9e88'

function findPeaks(vals: number[]): number[] {
  const peaks: number[] = []
  for (let i = 2; i < vals.length - 2; i++) {
    if (vals[i] > vals[i - 1] && vals[i] >= vals[i + 1]) peaks.push(i)
  }
  return peaks
}

function findTroughs(vals: number[]): number[] {
  const troughs: number[] = []
  for (let i = 2; i < vals.length - 2; i++) {
    if (vals[i] < vals[i - 1] && vals[i] <= vals[i + 1]) troughs.push(i)
  }
  return troughs
}

const CANDLE_PATTERNS = new Set([
  'Hammer', 'Inverted Hammer', 'Shooting Star', 'Hanging Man',
  'Bullish Engulfing', 'Bearish Engulfing', 'Piercing Line', 'Dark Cloud Cover',
  'Morning Star', 'Morning Doji Star', 'Evening Star', 'Evening Doji Star',
  'Three White Soldiers', 'Three Black Crows', 'Dragonfly Doji', 'Gravestone Doji', 'Harami',
])

export function buildPatternOverlay(
  candles: Candle[],
  pattern: PatternName,
  bias: PatternBias,
  support: number,
  resistance: number,
  patternCandleIdx?: number,
): PatternOverlay {
  const closes = candles.map((c) => c.c)
  const highs = candles.map((c) => c.h)
  const lows = candles.map((c) => c.l)
  const n = candles.length - 1
  const color = bias === 'bullish' ? BULL : bias === 'bearish' ? BEAR : NEUTRAL
  const lines: OverlayLine[] = []
  const markers: OverlayMarker[] = []

  if (CANDLE_PATTERNS.has(pattern) && patternCandleIdx !== undefined) {
    const start = Math.max(0, patternCandleIdx - (pattern.includes('Three') || pattern.includes('Star') ? 2 : pattern.includes('Engulfing') || pattern.includes('Line') || pattern.includes('Cover') || pattern === 'Harami' ? 1 : 0))
    return {
      lines: [
        { from: { idx: 0, price: support }, to: { idx: n, price: support }, color: BEAR + '99', dashed: true },
        { from: { idx: 0, price: resistance }, to: { idx: n, price: resistance }, color: BULL + '99', dashed: true },
      ],
      markers: [{ idx: patternCandleIdx, price: closes[patternCandleIdx], color }],
      highlightZone: { startIdx: start, endIdx: patternCandleIdx, color: color + '18' },
    }
  }

  const peaks = findPeaks(closes)
  const troughs = findTroughs(closes)

  switch (pattern) {
    case 'Double Bottom': {
      const t = troughs.slice(-2)
      if (t.length >= 2) {
        markers.push({ idx: t[0], price: lows[t[0]], color }, { idx: t[1], price: lows[t[1]], color })
        lines.push({ from: { idx: t[0], price: resistance }, to: { idx: n, price: resistance }, color, dashed: true })
      }
      break
    }
    case 'Double Top': {
      const p = peaks.slice(-2)
      if (p.length >= 2) {
        markers.push({ idx: p[0], price: highs[p[0]], color }, { idx: p[1], price: highs[p[1]], color })
        lines.push({ from: { idx: p[0], price: support }, to: { idx: n, price: support }, color, dashed: true })
      }
      break
    }
    case 'Head & Shoulders': {
      const p = peaks.slice(-3)
      if (p.length >= 3) {
        markers.push(...p.map((idx) => ({ idx, price: highs[idx], color })))
        lines.push({ from: { idx: p[0], price: support }, to: { idx: n, price: support }, color, dashed: true })
      }
      break
    }
    case 'Inverse Head & Shoulders': {
      const t = troughs.slice(-3)
      if (t.length >= 3) {
        markers.push(...t.map((idx) => ({ idx, price: lows[idx], color })))
        lines.push({ from: { idx: t[0], price: resistance }, to: { idx: n, price: resistance }, color, dashed: true })
      }
      break
    }
    case 'Ascending Triangle': {
      const t = troughs.slice(-2)
      if (t.length >= 2)
        lines.push({ from: { idx: t[0], price: lows[t[0]] }, to: { idx: t[1], price: lows[t[1]] }, color })
      lines.push({ from: { idx: 0, price: resistance }, to: { idx: n, price: resistance }, color, dashed: true })
      break
    }
    case 'Descending Triangle': {
      const p = peaks.slice(-2)
      if (p.length >= 2)
        lines.push({ from: { idx: p[0], price: highs[p[0]] }, to: { idx: p[1], price: highs[p[1]] }, color })
      lines.push({ from: { idx: 0, price: support }, to: { idx: n, price: support }, color, dashed: true })
      break
    }
    default:
      lines.push(
        { from: { idx: 0, price: support }, to: { idx: n, price: support }, color: BEAR + '99', dashed: true },
        { from: { idx: 0, price: resistance }, to: { idx: n, price: resistance }, color: BULL + '99', dashed: true },
      )
  }

  const startHighlight = Math.max(0, n - Math.floor(n * 0.45))
  return {
    lines,
    markers,
    highlightZone: { startIdx: startHighlight, endIdx: n, color: color + '12' },
  }
}