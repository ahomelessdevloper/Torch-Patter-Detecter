import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Filter,
  Clock,
} from 'lucide-react'
import { useMarketPatterns, type MarketPattern } from '../hooks/useMarketPatterns'
import { Sparkline } from '../components/patterns/Sparkline'
import { PatternDetailModal } from '../components/patterns/PatternDetailModal'
import { Badge } from '../components/ui/Badge'
import { formatPrice, formatVolume } from '../utils/format'
import {
  CHART_RESOLUTION_OPTIONS,
  CANDLE_COUNT_OPTIONS,
  DEFAULT_CANDLE_COUNT,
  DEFAULT_CHART_RESOLUTION,
  getTimeframeLabel,
  type CandleCount,
  type ChartResolution,
} from '../constants/chart'
import type { PatternBias } from '../utils/patternDetection'

type BiasFilter = 'all' | PatternBias

const biasConfig = {
  bullish: { label: 'Bullish', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
  bearish: { label: 'Bearish', icon: TrendingDown, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
  neutral: { label: 'Neutral', icon: Minus, color: 'text-muted', bg: 'bg-surface-overlay border-border-subtle' },
}

function PatternRow({ item, rank, onClick }: { item: MarketPattern; rank: number; onClick: () => void }) {
  const { market, pattern, live } = item
  const cfg = biasConfig[pattern.bias as keyof typeof biasConfig]
  const Icon = cfg.icon
  const highConf = pattern.confidence >= 70

  return (
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClick}
        className={`md:hidden w-full text-left px-4 py-4 border-b border-border-subtle last:border-0 hover:bg-surface-overlay/40 active:bg-surface-overlay/60 ${
          highConf ? 'bg-accent/[0.03]' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs text-muted w-5 shrink-0">{rank}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-base">{market.symbol}</span>
                <span className="text-xs text-muted">PERP</span>
                {highConf && <Badge variant="accent">{pattern.confidence}%</Badge>}
                {live && <Badge variant="live" dot>Live</Badge>}
              </div>
              <div className="font-mono text-sm mt-0.5">{formatPrice(pattern.currentPrice)}</div>
            </div>
          </div>
          <div className={`text-xs font-mono shrink-0 ${market.daily_price_change >= 0 ? 'text-accent' : 'text-danger'}`}>
            {market.daily_price_change >= 0 ? '+' : ''}{market.daily_price_change.toFixed(2)}%
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap pl-7">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
            <Icon className="h-3 w-3" />
            {pattern.pattern}
          </span>
          <span className="text-xs text-muted capitalize">{pattern.category}</span>
          <span className="text-xs text-muted font-mono">{pattern.resolution}</span>
          {!highConf && <span className="text-xs text-muted">{pattern.confidence}%</span>}
        </div>

        <div className="grid grid-cols-2 gap-2 pl-7">
          <div className="rounded-lg bg-accent/5 border border-accent/15 px-3 py-2">
            <div className="text-[10px] text-accent/80 mb-0.5 flex items-center gap-0.5">
              <ArrowUp className="h-2.5 w-2.5" /> Upside
            </div>
            <div className="text-xs font-mono text-accent">+{pattern.upsidePercent.toFixed(1)}%</div>
          </div>
          <div className="rounded-lg bg-danger/5 border border-danger/15 px-3 py-2">
            <div className="text-[10px] text-danger/80 mb-0.5 flex items-center gap-0.5">
              <ArrowDown className="h-2.5 w-2.5" /> Downside
            </div>
            <div className="text-xs font-mono text-danger">{pattern.downsidePercent.toFixed(1)}%</div>
          </div>
        </div>
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClick}
        className={`hidden md:grid w-full grid-cols-[auto_1fr_90px_repeat(5,auto)] gap-4 items-center px-6 py-3.5 border-b border-border-subtle last:border-0 hover:bg-surface-overlay/40 text-left group ${
          highConf ? 'bg-accent/[0.03]' : ''
        }`}
      >
        <div className="font-mono text-sm text-muted w-6">{rank}</div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-base">{market.symbol}</span>
            <span className="text-xs text-muted">PERP</span>
            {highConf && <Badge variant="accent">{pattern.confidence}%</Badge>}
            {live && <Badge variant="live" dot>Live</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <Icon className="h-3 w-3" />
              {pattern.pattern}
            </span>
            <span className="text-xs text-muted capitalize">{pattern.category}</span>
            {!highConf && <span className="text-xs text-muted">{pattern.confidence}%</span>}
          </div>
        </div>

        <div className="w-[90px]">
          <Sparkline data={pattern.sparkline} bullish={pattern.bias === 'bullish'} bearish={pattern.bias === 'bearish'} height={30} />
        </div>

        <div className="flex items-center gap-1 text-xs text-muted">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="font-mono">{pattern.resolution}</span>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm">{formatPrice(pattern.currentPrice)}</div>
          <div className={`text-xs font-mono ${market.daily_price_change >= 0 ? 'text-accent' : 'text-danger'}`}>
            {market.daily_price_change >= 0 ? '+' : ''}{market.daily_price_change.toFixed(2)}%
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm text-accent flex items-center justify-end gap-0.5">
            <ArrowUp className="h-3 w-3" />
            {formatPrice(pattern.upsideTarget)}
          </div>
          <div className="text-xs text-muted">+{pattern.upsidePercent.toFixed(1)}%</div>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm text-danger flex items-center justify-end gap-0.5">
            <ArrowDown className="h-3 w-3" />
            {formatPrice(pattern.downsideTarget)}
          </div>
          <div className="text-xs text-muted">{pattern.downsidePercent.toFixed(1)}%</div>
        </div>

        <div className="text-right font-mono text-xs text-muted">
          {formatVolume(market.daily_base_token_volume)}
        </div>
      </motion.button>
    </>
  )
}

export function Patterns() {
  const [resolution, setResolution] = useState<ChartResolution>(DEFAULT_CHART_RESOLUTION)
  const [candleCount, setCandleCount] = useState<CandleCount>(DEFAULT_CANDLE_COUNT)
  const { patterns, loading, deepScanning, deepProgress, error, refresh } = useMarketPatterns({ resolution, candleCount })
  const [query, setQuery] = useState('')
  const [biasFilter, setBiasFilter] = useState<BiasFilter>('all')
  const [minConfidence, setMinConfidence] = useState(70)
  const [selected, setSelected] = useState<MarketPattern | null>(null)

  const filtered = useMemo(() => {
    return patterns
      .filter((p) => {
        if (biasFilter !== 'all' && p.pattern.bias !== biasFilter) return false
        if (p.pattern.confidence < minConfidence) return false
        if (query && !p.market.symbol.toLowerCase().includes(query.toLowerCase())) return false
        return true
      })
      .sort((a, b) => b.pattern.confidence - a.pattern.confidence)
  }, [patterns, query, biasFilter, minConfidence])

  const counts = useMemo(() => ({
    highConf: patterns.filter((p) => p.pattern.confidence >= 70).length,
    bullish: patterns.filter((p) => p.pattern.bias === 'bullish' && p.pattern.confidence >= 70).length,
    bearish: patterns.filter((p) => p.pattern.bias === 'bearish' && p.pattern.confidence >= 70).length,
    candlestick: patterns.filter((p) => p.pattern.category === 'candlestick' && p.pattern.confidence >= 70).length,
  }), [patterns])

  return (
    <div className="min-h-screen pt-14 pb-8 sm:pb-12" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
      <div className="glow-orb top-28 left-1/3 h-56 w-72 bg-accent/5" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 relative">
        <div className="mb-7">
          <div className="flex items-center gap-2 text-accent/90 mb-2 text-xs font-medium uppercase tracking-wider">
            <BarChart2 className="h-3.5 w-3.5" />
            Torch Scanner · {getTimeframeLabel(resolution, candleCount)}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1.5">Pattern Scanner</h1>
          <p className="text-muted text-sm max-w-xl">
            All Lighter perps · 70%+ confidence first · click any token for full chart.
          </p>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-16 text-center">
            <RefreshCw className="h-8 w-8 text-accent animate-spin mx-auto mb-4" />
            <p className="text-muted">Loading Lighter markets...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-12 text-center text-danger">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: '≥70% Confidence', value: counts.highConf, color: 'text-accent' },
                { label: 'Bullish ≥70%', value: counts.bullish, color: 'text-accent' },
                { label: 'Bearish ≥70%', value: counts.bearish, color: 'text-danger' },
                { label: 'Candlestick ≥70%', value: counts.candlestick, color: 'text-white' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 card-hover">
                  <div className="text-xs text-muted mb-1">{s.label}</div>
                  <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {deepScanning && (
              <div className="glass rounded-xl p-4 mb-6 flex items-center gap-4">
                <RefreshCw className="h-4 w-4 text-accent animate-spin shrink-0" />
                <div className="flex-1">
                  <div className="text-sm mb-1.5">Live {resolution} candles loading... {deepProgress}%</div>
                  <div className="h-1.5 bg-surface-overlay rounded-full">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${deepProgress}%` }} />
                  </div>
                </div>
              </div>
            )}

            <div className="glass rounded-2xl p-3 sm:p-4 mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Clock className="h-4 w-4 text-muted" />
                    <span className="text-xs text-muted">Timeframe</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CHART_RESOLUTION_OPTIONS.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setResolution(tf)}
                        className={`text-xs px-3 py-2 sm:py-1.5 rounded-lg border font-mono transition-colors min-h-[36px] sm:min-h-0 ${
                          resolution === tf
                            ? 'bg-accent/10 border-accent/30 text-accent'
                            : 'border-border-subtle text-muted hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <BarChart2 className="h-4 w-4 text-muted" />
                    <span className="text-xs text-muted">Candles</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CANDLE_COUNT_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setCandleCount(n)}
                        className={`text-xs px-3 py-2 sm:py-1.5 rounded-lg border font-mono transition-colors min-h-[36px] sm:min-h-0 ${
                          candleCount === n
                            ? 'bg-accent/10 border-accent/30 text-accent'
                            : 'border-border-subtle text-muted hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search token — BTC, ETH, SOL..."
                  className="w-full bg-surface-overlay border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-accent/40"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="h-4 w-4 text-muted shrink-0" />
                  {(['all', 'bullish', 'bearish', 'neutral'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setBiasFilter(f)}
                      className={`text-xs px-3 py-2 sm:py-1.5 rounded-lg border capitalize transition-colors min-h-[36px] sm:min-h-0 ${
                        biasFilter === f ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border-subtle text-muted hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 items-center sm:ml-auto">
                  <select
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(Number(e.target.value))}
                    className="flex-1 sm:flex-none text-xs bg-surface-overlay border border-border-subtle rounded-lg px-3 py-2 sm:py-1.5 text-muted outline-none min-h-[36px] sm:min-h-0"
                  >
                    <option value={70}>≥70% confidence (default)</option>
                    <option value={60}>≥60% confidence</option>
                    <option value={50}>≥50% confidence</option>
                    <option value={40}>All patterns</option>
                  </select>
                  <button
                    onClick={refresh}
                    className="text-xs px-3 py-2 sm:py-1.5 rounded-lg border border-border-subtle text-muted hover:text-white flex items-center gap-1.5 min-h-[36px] sm:min-h-0"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="hidden md:grid grid-cols-[auto_1fr_90px_repeat(5,auto)] gap-4 px-6 py-3 border-b border-border-subtle text-xs text-muted uppercase tracking-wider">
                <div>#</div>
                <div>Token / Pattern</div>
                <div>Chart</div>
                <div>TF</div>
                <div className="text-right">Price</div>
                <div className="text-right">↑ Upside</div>
                <div className="text-right">↓ Downside</div>
                <div className="text-right">Vol</div>
              </div>

              {filtered.map((item, i) => (
                <PatternRow key={item.market.market_id} item={item} rank={i + 1} onClick={() => setSelected(item)} />
              ))}

              {filtered.length === 0 && (
                <div className="py-16 text-center text-muted text-sm">
                  No patterns found at 70%+ confidence. Try lowering the filter.
                </div>
              )}
            </div>

            <p className="text-xs text-muted text-center mt-6">
              {filtered.length} tokens · {getTimeframeLabel(resolution, candleCount)} · Patterns from StockCharts dictionary
            </p>
          </>
        )}
      </div>

      <PatternDetailModal
        item={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        resolution={resolution}
        candleCount={candleCount}
      />
    </div>
  )
}