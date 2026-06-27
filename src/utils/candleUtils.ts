import type { Candle } from '../services/lighterApi'

export function buildSyntheticCandles(
  price: number,
  low: number,
  high: number,
  change: number,
  count = 50,
): Candle[] {
  const candles: Candle[] = []
  const start = price / (1 + change / 100)
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const wave = Math.sin(i * 0.45 + price * 0.001) * 0.015 + Math.cos(i * 0.22) * 0.01
    const trend = start + (price - start) * t
    const c = trend * (1 + wave)
    const h = Math.min(high * 1.002, c * 1.012)
    const l = Math.max(low * 0.998, c * 0.988)
    const o = i === 0 ? start : candles[i - 1].c
    candles.push({ t: i, o, h: Math.max(o, h, c), l: Math.min(o, l, c), c })
  }
  return candles
}