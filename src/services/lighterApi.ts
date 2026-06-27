import { getResolutionMinutes } from '../constants/chart'

const BASE_URL = 'https://mainnet.zklighter.elliot.ai'

export interface MarketDetail {
  symbol: string
  market_id: number
  market_type: string
  last_trade_price: number
  daily_price_low: number
  daily_price_high: number
  daily_price_change: number
  daily_base_token_volume: number
  open_interest: number
  status: string
}

export interface Candle {
  t: number
  o: number
  h: number
  l: number
  c: number
}

interface OrderBookResponse {
  code: number
  order_book_details: Array<{
    symbol: string
    market_id: number
    market_type: string
    status: string
    last_trade_price: number
    daily_price_low: number
    daily_price_high: number
    daily_price_change: number
    daily_base_token_volume: number
    open_interest: number
  }>
}

interface CandlesResponse {
  code: number
  c: Candle[]
}

export async function fetchAllMarkets(): Promise<MarketDetail[]> {
  const res = await fetch(`${BASE_URL}/api/v1/orderBookDetails`)
  const data: OrderBookResponse = await res.json()
  return data.order_book_details
    .filter((m) => m.market_type === 'perp' && m.status === 'active' && m.last_trade_price > 0)
    .map((m) => ({
      symbol: m.symbol,
      market_id: m.market_id,
      market_type: m.market_type,
      last_trade_price: m.last_trade_price,
      daily_price_low: m.daily_price_low,
      daily_price_high: m.daily_price_high,
      daily_price_change: m.daily_price_change,
      daily_base_token_volume: m.daily_base_token_volume,
      open_interest: m.open_interest,
      status: m.status,
    }))
    .sort((a, b) => b.daily_base_token_volume - a.daily_base_token_volume)
}

export async function fetchCandles(marketId: number, resolution = '4h', count = 60): Promise<Candle[]> {
  const end = Date.now()
  const start = end - count * getResolutionMinutes(resolution) * 60 * 1000
  const params = new URLSearchParams({
    market_id: String(marketId),
    resolution,
    start_timestamp: String(start),
    end_timestamp: String(end),
    count_back: String(count),
  })
  const res = await fetch(`${BASE_URL}/api/v1/candles?${params}`)
  const data: CandlesResponse = await res.json()
  return data.c || []
}