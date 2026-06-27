import { useState, useEffect, useCallback } from 'react'
import { fetchAllMarkets, fetchCandles, type MarketDetail, type Candle } from '../services/lighterApi'
import { detectPattern, type PatternResult } from '../utils/patternDetection'
import { buildSyntheticCandles } from '../utils/candleUtils'
import type { CandleCount, ChartResolution } from '../constants/chart'
import { DEFAULT_CANDLE_COUNT, DEFAULT_CHART_RESOLUTION } from '../constants/chart'

export interface MarketPattern {
  market: MarketDetail
  pattern: PatternResult
  candles: Candle[]
  live: boolean
}

export interface ScanOptions {
  resolution: ChartResolution
  candleCount: CandleCount
}

function quickAnalyze(market: MarketDetail, resolution: ChartResolution): MarketPattern {
  const candles = buildSyntheticCandles(
    market.last_trade_price,
    market.daily_price_low,
    market.daily_price_high,
    market.daily_price_change,
  )
  return {
    market,
    pattern: detectPattern(candles, market.last_trade_price, resolution),
    candles,
    live: false,
  }
}

const DEEP_SCAN_COUNT = 40
const BATCH = 6

export function useMarketPatterns(options: ScanOptions = { resolution: DEFAULT_CHART_RESOLUTION, candleCount: DEFAULT_CANDLE_COUNT }) {
  const { resolution, candleCount } = options
  const [patterns, setPatterns] = useState<MarketPattern[]>([])
  const [loading, setLoading] = useState(true)
  const [deepScanning, setDeepScanning] = useState(false)
  const [deepProgress, setDeepProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setDeepProgress(0)
    try {
      const markets = await fetchAllMarkets()
      const quick = markets.map((m) => quickAnalyze(m, resolution))
      setPatterns(quick)
      setLoading(false)

      setDeepScanning(true)
      const top = markets.slice(0, DEEP_SCAN_COUNT)
      for (let i = 0; i < top.length; i += BATCH) {
        const batch = top.slice(i, i + BATCH)
        await Promise.all(
          batch.map(async (market) => {
            try {
              const candles = await fetchCandles(market.market_id, resolution, candleCount)
              if (candles.length >= 10) {
                setPatterns((prev) =>
                  prev.map((p) =>
                    p.market.market_id === market.market_id
                      ? {
                          market,
                          pattern: detectPattern(candles, market.last_trade_price, resolution),
                          candles,
                          live: true,
                        }
                      : p,
                  ),
                )
              }
            } catch {}
          }),
        )
        setDeepProgress(Math.round(((i + batch.length) / top.length) * 100))
      }
      setDeepScanning(false)
    } catch {
      setError('Failed to load Lighter markets')
      setLoading(false)
      setDeepScanning(false)
    }
  }, [resolution, candleCount])

  useEffect(() => {
    load()
  }, [load])

  return { patterns, loading, deepScanning, deepProgress, error, refresh: load, resolution, candleCount }
}

export async function loadMarketCandles(
  market: MarketDetail,
  resolution: ChartResolution = DEFAULT_CHART_RESOLUTION,
  candleCount: CandleCount = DEFAULT_CANDLE_COUNT,
): Promise<Candle[]> {
  try {
    const candles = await fetchCandles(market.market_id, resolution, candleCount)
    if (candles.length >= 10) return candles
  } catch {}
  return buildSyntheticCandles(
    market.last_trade_price,
    market.daily_price_low,
    market.daily_price_high,
    market.daily_price_change,
  )
}