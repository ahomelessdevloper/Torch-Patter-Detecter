import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, Shield, RefreshCw, Clock } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { CandlePatternChart } from './CandlePatternChart'
import type { MarketPattern } from '../../hooks/useMarketPatterns'
import { loadMarketCandles } from '../../hooks/useMarketPatterns'
import { detectPattern } from '../../utils/patternDetection'
import { formatPrice } from '../../utils/format'
import { getTimeframeLabel, getMarketSpanLabel, type CandleCount, type ChartResolution } from '../../constants/chart'
import { getPatternMeta } from '../../data/candlePatterns'
import type { Candle } from '../../services/lighterApi'
import type { PatternResult } from '../../utils/patternDetection'

interface PatternDetailModalProps {
  item: MarketPattern | null
  open: boolean
  onClose: () => void
  resolution: ChartResolution
  candleCount: CandleCount
}

export function PatternDetailModal({ item, open, onClose, resolution, candleCount }: PatternDetailModalProps) {
  const [candles, setCandles] = useState<Candle[]>([])
  const [pattern, setPattern] = useState<PatternResult | null>(null)
  const [loadingChart, setLoadingChart] = useState(false)

  useEffect(() => {
    if (!open || !item) return
    const needsFetch =
      !item.live ||
      item.pattern.resolution !== resolution ||
      item.pattern.candleCount !== candleCount

    if (!needsFetch) {
      setCandles(item.candles)
      setPattern(item.pattern)
      return
    }

    setLoadingChart(true)
    loadMarketCandles(item.market, resolution, candleCount).then((liveCandles) => {
      setCandles(liveCandles)
      setPattern(detectPattern(liveCandles, item.market.last_trade_price, resolution))
      setLoadingChart(false)
    })
  }, [open, item, resolution, candleCount])

  if (!item || !pattern) return null

  const { market } = item
  const meta = getPatternMeta(pattern.pattern)
  const isBull = pattern.bias === 'bullish'
  const isBear = pattern.bias === 'bearish'

  return (
    <Modal open={open} onClose={onClose} title={`${market.symbol}-PERP`} xl>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg sm:text-xl font-bold">{market.symbol}</span>
            <Badge variant="muted">PERP</Badge>
            {pattern.confidence >= 70 && <Badge variant="accent">{pattern.confidence}% High</Badge>}
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono">{formatPrice(pattern.currentPrice)}</div>
          <div className={`text-sm font-mono ${market.daily_price_change >= 0 ? 'text-accent' : 'text-danger'}`}>
            {market.daily_price_change >= 0 ? '+' : ''}{market.daily_price_change.toFixed(2)}% 24h
          </div>
        </div>
        <div className="sm:text-right space-y-1.5">
          <Badge variant={isBull ? 'accent' : isBear ? 'danger' : 'muted'}>{pattern.pattern}</Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">
            <Clock className="h-3.5 w-3.5" />
            {getTimeframeLabel(pattern.resolution, pattern.candleCount)}
          </div>
          <div className="text-xs text-muted capitalize">{pattern.category} pattern · {pattern.resolution} per candle</div>
        </div>
      </div>

      {meta && (
        <p className="text-xs text-muted mb-4 px-3 py-2 rounded-lg bg-surface-overlay border border-border-subtle">
          {meta.description}
        </p>
      )}

      <div className="rounded-xl bg-surface-overlay border border-border-subtle p-2 sm:p-3 mb-5 relative">
        {loadingChart && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60 rounded-xl z-10">
            <RefreshCw className="h-6 w-6 text-accent animate-spin" />
          </div>
        )}
        <CandlePatternChart symbol={market.symbol} candles={candles} pattern={pattern} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-1.5 text-xs text-accent mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Upside Target ({getMarketSpanLabel(pattern.candleCount, pattern.resolution)} view)
          </div>
          <div className="text-lg font-bold font-mono text-accent">{formatPrice(pattern.upsideTarget)}</div>
          <div className="text-sm font-mono text-accent/80">+{pattern.upsidePercent.toFixed(1)}%</div>
        </div>
        <div className="p-4 rounded-xl bg-danger/5 border border-danger/20">
          <div className="flex items-center gap-1.5 text-xs text-danger mb-2">
            <TrendingDown className="h-3.5 w-3.5" />
            Downside Target ({getMarketSpanLabel(pattern.candleCount, pattern.resolution)} view)
          </div>
          <div className="text-lg font-bold font-mono text-danger">{formatPrice(pattern.downsideTarget)}</div>
          <div className="text-sm font-mono text-danger/80">{pattern.downsidePercent.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center justify-between p-3 rounded-xl border border-border-subtle">
          <span className="text-muted flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Support</span>
          <span className="font-mono text-sm">{formatPrice(pattern.support)}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border border-border-subtle">
          <span className="text-muted flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Resistance</span>
          <span className="font-mono text-sm">{formatPrice(pattern.resistance)}</span>
        </div>
      </div>
    </Modal>
  )
}