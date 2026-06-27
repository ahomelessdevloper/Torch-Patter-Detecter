import type { Candle } from '../services/lighterApi'
import type { PatternBias } from '../data/candlePatterns'

export interface CandlestickHit {
  name: string
  bias: PatternBias
  confidence: number
  candleIdx: number
}

function body(c: Candle) { return Math.abs(c.c - c.o) }
function range(c: Candle) { return c.h - c.l || 0.0001 }
function isBull(c: Candle) { return c.c >= c.o }
function upperShadow(c: Candle) { return c.h - Math.max(c.o, c.c) }
function lowerShadow(c: Candle) { return Math.min(c.o, c.c) - c.l }
function isDoji(c: Candle) { return body(c) / range(c) < 0.1 }
function avgBody(candles: Candle[], n = 10) {
  const slice = candles.slice(-n)
  return slice.reduce((s, c) => s + body(c), 0) / slice.length || 0.0001
}

function isDowntrend(closes: number[], i: number): boolean {
  if (i < 5) return closes[i] < closes[0]
  return closes[i] < closes[i - 5]
}

function isUptrend(closes: number[], i: number): boolean {
  if (i < 5) return closes[i] > closes[0]
  return closes[i] > closes[i - 5]
}

export function detectCandlestickPatterns(candles: Candle[]): CandlestickHit | null {
  if (candles.length < 3) return null

  const hits: CandlestickHit[] = []
  const closes = candles.map((c) => c.c)
  const n = candles.length - 1
  const c0 = candles[n]
  const c1 = candles[n - 1]
  const c2 = candles[n - 2]
  const avg = avgBody(candles)

  if (
    lowerShadow(c0) > body(c0) * 2 &&
    upperShadow(c0) < body(c0) * 0.5 &&
    isDowntrend(closes, n)
  ) {
    hits.push({ name: 'Hammer', bias: 'bullish', confidence: 74, candleIdx: n })
  }

  if (
    upperShadow(c0) > body(c0) * 2 &&
    lowerShadow(c0) < body(c0) * 0.5 &&
    isDowntrend(closes, n)
  ) {
    hits.push({ name: 'Inverted Hammer', bias: 'bullish', confidence: 71, candleIdx: n })
  }

  if (
    upperShadow(c0) > body(c0) * 2 &&
    lowerShadow(c0) < body(c0) * 0.5 &&
    isUptrend(closes, n)
  ) {
    hits.push({ name: 'Shooting Star', bias: 'bearish', confidence: 75, candleIdx: n })
  }

  if (
    lowerShadow(c0) > body(c0) * 2 &&
    upperShadow(c0) < body(c0) * 0.5 &&
    isUptrend(closes, n)
  ) {
    hits.push({ name: 'Hanging Man', bias: 'bearish', confidence: 72, candleIdx: n })
  }

  if (!isBull(c1) && isBull(c0) && c0.o <= c1.c && c0.c >= c1.o && body(c0) > body(c1)) {
    hits.push({ name: 'Bullish Engulfing', bias: 'bullish', confidence: 78, candleIdx: n })
  }

  if (isBull(c1) && !isBull(c0) && c0.o >= c1.c && c0.c <= c1.o && body(c0) > body(c1)) {
    hits.push({ name: 'Bearish Engulfing', bias: 'bearish', confidence: 78, candleIdx: n })
  }

  if (!isBull(c1) && isBull(c0) && c0.o < c1.l && c0.c > (c1.o + c1.c) / 2) {
    hits.push({ name: 'Piercing Line', bias: 'bullish', confidence: 76, candleIdx: n })
  }

  if (isBull(c1) && !isBull(c0) && c0.o > c1.h && c0.c < (c1.o + c1.c) / 2) {
    hits.push({ name: 'Dark Cloud Cover', bias: 'bearish', confidence: 76, candleIdx: n })
  }

  if (
    !isBull(c2) && body(c2) > avg * 0.8 &&
    body(c1) < avg * 0.4 &&
    isBull(c0) && body(c0) > avg * 0.8 &&
    c0.c > (c2.o + c2.c) / 2
  ) {
    hits.push({ name: isDoji(c1) ? 'Morning Doji Star' : 'Morning Star', bias: 'bullish', confidence: 80, candleIdx: n })
  }

  if (
    isBull(c2) && body(c2) > avg * 0.8 &&
    body(c1) < avg * 0.4 &&
    !isBull(c0) && body(c0) > avg * 0.8 &&
    c0.c < (c2.o + c2.c) / 2
  ) {
    hits.push({ name: isDoji(c1) ? 'Evening Doji Star' : 'Evening Star', bias: 'bearish', confidence: 80, candleIdx: n })
  }

  if (candles.length >= 3) {
    const [a, b, c] = candles.slice(-3)
    if (isBull(a) && isBull(b) && isBull(c) &&
        body(a) > avg * 0.6 && body(b) > avg * 0.6 && body(c) > avg * 0.6 &&
        c.c > b.c && b.c > a.c) {
      hits.push({ name: 'Three White Soldiers', bias: 'bullish', confidence: 82, candleIdx: n })
    }
  }

  if (candles.length >= 3) {
    const [a, b, c] = candles.slice(-3)
    if (!isBull(a) && !isBull(b) && !isBull(c) &&
        body(a) > avg * 0.6 && body(b) > avg * 0.6 && body(c) > avg * 0.6 &&
        c.c < b.c && b.c < a.c) {
      hits.push({ name: 'Three Black Crows', bias: 'bearish', confidence: 82, candleIdx: n })
    }
  }

  if (isDoji(c0) && lowerShadow(c0) > range(c0) * 0.6 && upperShadow(c0) < range(c0) * 0.1) {
    hits.push({ name: 'Dragonfly Doji', bias: 'bullish', confidence: 73, candleIdx: n })
  }

  if (isDoji(c0) && upperShadow(c0) > range(c0) * 0.6 && lowerShadow(c0) < range(c0) * 0.1) {
    hits.push({ name: 'Gravestone Doji', bias: 'bearish', confidence: 73, candleIdx: n })
  }

  if (body(c0) < body(c1) * 0.5 &&
      c0.h < c1.h && c0.l > c1.l &&
      isBull(c1) !== isBull(c0)) {
    hits.push({ name: 'Harami', bias: isBull(c0) ? 'bullish' : 'bearish', confidence: 70, candleIdx: n })
  }

  if (hits.length === 0) return null
  return hits.sort((a, b) => b.confidence - a.confidence)[0]
}