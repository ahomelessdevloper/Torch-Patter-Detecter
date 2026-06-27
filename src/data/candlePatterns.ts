export type PatternBias = 'bullish' | 'bearish' | 'neutral'
export type PatternCategory = 'candlestick' | 'chart'

export interface PatternMeta {
  name: string
  bias: PatternBias
  category: PatternCategory
  description: string
}

export const CANDLESTICK_PATTERNS: PatternMeta[] = [
  { name: 'Hammer', bias: 'bullish', category: 'candlestick', description: 'Long lower shadow, small body at top — bullish reversal in downtrend' },
  { name: 'Inverted Hammer', bias: 'bullish', category: 'candlestick', description: 'Long upper shadow after decline — potential bullish reversal' },
  { name: 'Bullish Engulfing', bias: 'bullish', category: 'candlestick', description: 'Green body fully engulfs previous red body' },
  { name: 'Piercing Line', bias: 'bullish', category: 'candlestick', description: 'Opens lower, closes above midpoint of prior black candle' },
  { name: 'Morning Star', bias: 'bullish', category: 'candlestick', description: '3-day: long red, small gap-down body, long white closing above midpoint' },
  { name: 'Morning Doji Star', bias: 'bullish', category: 'candlestick', description: 'Morning Star with Doji as middle candle' },
  { name: 'Three White Soldiers', bias: 'bullish', category: 'candlestick', description: 'Three consecutive long white candles with higher closes' },
  { name: 'Dragonfly Doji', bias: 'bullish', category: 'candlestick', description: 'Open/close at high — long lower shadow, reversal signal' },
  { name: 'Rising Three Methods', bias: 'bullish', category: 'candlestick', description: 'Bullish continuation — long white, 3 small inside days, new high' },
  { name: 'Shooting Star', bias: 'bearish', category: 'candlestick', description: 'Small body at bottom, long upper shadow in uptrend' },
  { name: 'Hanging Man', bias: 'bearish', category: 'candlestick', description: 'Hammer shape in uptrend — bearish warning' },
  { name: 'Bearish Engulfing', bias: 'bearish', category: 'candlestick', description: 'Red body fully engulfs previous green body' },
  { name: 'Dark Cloud Cover', bias: 'bearish', category: 'candlestick', description: 'Opens higher, closes below midpoint of prior white candle' },
  { name: 'Evening Star', bias: 'bearish', category: 'candlestick', description: '3-day: long white, small gap-up body, down close below midpoint' },
  { name: 'Evening Doji Star', bias: 'bearish', category: 'candlestick', description: 'Evening Star with Doji as middle candle' },
  { name: 'Three Black Crows', bias: 'bearish', category: 'candlestick', description: 'Three consecutive long black candles with lower closes' },
  { name: 'Gravestone Doji', bias: 'bearish', category: 'candlestick', description: 'Open/close at low — long upper shadow' },
  { name: 'Falling Three Methods', bias: 'bearish', category: 'candlestick', description: 'Bearish continuation — long black, 3 small inside days, new low' },
  { name: 'Doji', bias: 'neutral', category: 'candlestick', description: 'Open equals close — indecision at turning point' },
  { name: 'Harami', bias: 'neutral', category: 'candlestick', description: 'Small body contained within prior body — reversal hint' },
]

export const CHART_PATTERNS: PatternMeta[] = [
  { name: 'Double Bottom', bias: 'bullish', category: 'chart', description: 'Two equal lows then breakout above neckline' },
  { name: 'Inverse Head & Shoulders', bias: 'bullish', category: 'chart', description: 'Three troughs — middle lowest, bullish reversal' },
  { name: 'Bull Flag', bias: 'bullish', category: 'chart', description: 'Sharp rally (pole) then tight downward channel' },
  { name: 'Ascending Triangle', bias: 'bullish', category: 'chart', description: 'Flat resistance + rising support' },
  { name: 'Cup & Handle', bias: 'bullish', category: 'chart', description: 'U-shaped base with small pullback handle' },
  { name: 'Double Top', bias: 'bearish', category: 'chart', description: 'Two equal highs then breakdown below neckline' },
  { name: 'Head & Shoulders', bias: 'bearish', category: 'chart', description: 'Three peaks — middle highest, bearish reversal' },
  { name: 'Bear Flag', bias: 'bearish', category: 'chart', description: 'Sharp drop (pole) then tight upward channel' },
  { name: 'Descending Triangle', bias: 'bearish', category: 'chart', description: 'Flat support + falling resistance' },
]

export const ALL_PATTERN_NAMES = [
  ...CANDLESTICK_PATTERNS.map((p) => p.name),
  ...CHART_PATTERNS.map((p) => p.name),
  'Breakout Up', 'Breakdown', 'Consolidation',
] as const

export type PatternName = (typeof ALL_PATTERN_NAMES)[number]

export function getPatternMeta(name: string): PatternMeta | undefined {
  return [...CANDLESTICK_PATTERNS, ...CHART_PATTERNS].find((p) => p.name === name)
}