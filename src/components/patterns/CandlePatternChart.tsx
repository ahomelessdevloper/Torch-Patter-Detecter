import type { Candle } from '../../services/lighterApi'
import type { PatternResult } from '../../utils/patternDetection'
import { formatPrice } from '../../utils/format'
import { getTimeframeLabel } from '../../constants/chart'
import { useIsMobile } from '../../hooks/useMediaQuery'

interface CandlePatternChartProps {
  symbol: string
  candles: Candle[]
  pattern: PatternResult
  height?: number
}

const BULL = '#f59e0b'
const BEAR = '#f43f5e'
const MUTED = '#8b8b9e'

export function CandlePatternChart({ symbol, candles, pattern, height }: CandlePatternChartProps) {
  const isMobile = useIsMobile()
  const width = isMobile ? 340 : 720
  const chartHeight = height ?? (isMobile ? 260 : 360)
  const PAD = isMobile
    ? { top: 40, right: 52, bottom: 24, left: 4 }
    : { top: 52, right: 108, bottom: 32, left: 8 }

  const chartW = width - PAD.left - PAD.right
  const chartH = chartHeight - PAD.top - PAD.bottom

  const levels = [
    pattern.upsideTarget,
    pattern.resistance,
    pattern.currentPrice,
    pattern.support,
    pattern.downsideTarget,
    ...candles.flatMap((c) => [c.h, c.l]),
  ]
  const yMin = Math.min(...levels) * 0.999
  const yMax = Math.max(...levels) * 1.001
  const yRange = yMax - yMin || 1

  const toX = (idx: number) => PAD.left + (idx / Math.max(candles.length - 1, 1)) * chartW
  const toY = (price: number) => PAD.top + chartH - ((price - yMin) / yRange) * chartH
  const candleW = Math.max(isMobile ? 3 : 4, Math.min(isMobile ? 6 : 9, chartW / candles.length - 2))

  const targets = [
    { price: pattern.upsideTarget, color: BULL, label: '↑ Upside', pct: `+${pattern.upsidePercent.toFixed(1)}%` },
    { price: pattern.downsideTarget, color: BEAR, label: '↓ Downside', pct: `${pattern.downsidePercent.toFixed(1)}%` },
  ]

  const biasColor = pattern.bias === 'bullish' ? BULL : pattern.bias === 'bearish' ? BEAR : MUTED
  const headerFontSize = isMobile ? 13 : 15
  const badgeWidth = Math.min(pattern.pattern.length * (isMobile ? 5.5 : 6.5) + 24, chartW - 16)

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M3,0 L6,6 L0,6 Z" fill={BULL} />
          </marker>
          <marker id="arrDn" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,0 L3,6 Z" fill={BEAR} />
          </marker>
        </defs>

        <rect x={PAD.left} y={8} width={chartW} height={isMobile ? 28 : 36} rx="8" fill="#111118" stroke="#1e1e2a" />
        <text x={PAD.left + 10} y={isMobile ? 26 : 30} fill="#fff" fontSize={headerFontSize} fontWeight="700" fontFamily="Tinos, Times New Roman, Times, serif">
          {symbol}
        </text>
        <text x={PAD.left + 10 + symbol.length * (isMobile ? 7 : 9) + 6} y={isMobile ? 26 : 30} fill={MUTED} fontSize={isMobile ? 9 : 11}>
          PERP
        </text>
        <rect x={PAD.left + chartW - (isMobile ? 120 : 168)} y={isMobile ? 12 : 16} width={isMobile ? 112 : 158} height={isMobile ? 16 : 20} rx="6" fill="#1a1a24" />
        <text x={PAD.left + chartW - (isMobile ? 112 : 160)} y={isMobile ? 23 : 30} fill={MUTED} fontSize={isMobile ? 7 : 9} fontFamily="Tinos, Times New Roman, Times, serif">
          {getTimeframeLabel(pattern.resolution, pattern.candleCount)}
        </text>

        {[0.25, 0.5, 0.75].map((f) => {
          const y = PAD.top + chartH * f
          return <line key={f} x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="#1e1e2a" strokeWidth="1" />
        })}

        {pattern.overlay.highlightZone && (
          <rect
            x={toX(pattern.overlay.highlightZone.startIdx) - candleW}
            y={PAD.top}
            width={toX(pattern.overlay.highlightZone.endIdx) - toX(pattern.overlay.highlightZone.startIdx) + candleW * 2}
            height={chartH}
            fill={pattern.overlay.highlightZone.color}
            rx="3"
          />
        )}

        {pattern.overlay.lines.map((line, i) => (
          <line
            key={i}
            x1={toX(line.from.idx)}
            y1={toY(line.from.price)}
            x2={toX(line.to.idx)}
            y2={toY(line.to.price)}
            stroke={line.color}
            strokeWidth="1.2"
            strokeDasharray={line.dashed ? '4 3' : undefined}
            opacity="0.85"
          />
        ))}

        {pattern.overlay.markers.map((m, i) => (
          <circle key={i} cx={toX(m.idx)} cy={toY(m.price)} r="3" fill="none" stroke={m.color} strokeWidth="1.5" />
        ))}

        {candles.map((c, i) => {
          const x = toX(i)
          const bullish = c.c >= c.o
          const color = bullish ? BULL : BEAR
          const bodyTop = toY(Math.max(c.o, c.c))
          const bodyBot = toY(Math.min(c.o, c.c))
          const isPatternCandle = i === pattern.patternCandleIdx
          return (
            <g key={i}>
              <line x1={x} y1={toY(c.h)} x2={x} y2={toY(c.l)} stroke={color} strokeWidth="1" opacity={isPatternCandle ? 1 : 0.75} />
              <rect
                x={x - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={Math.max(bodyBot - bodyTop, 1)}
                fill={color}
                stroke={isPatternCandle ? '#fff' : 'none'}
                strokeWidth={isPatternCandle ? 1 : 0}
                rx="0.5"
              />
            </g>
          )
        })}

        <line
          x1={PAD.left}
          y1={toY(pattern.currentPrice)}
          x2={PAD.left + chartW}
          y2={toY(pattern.currentPrice)}
          stroke="#ffffff50"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {targets.map((t) => {
          const y = toY(t.price)
          return (
            <g key={t.label}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + chartW + 6}
                y2={y}
                stroke={t.color}
                strokeWidth="1.5"
                strokeDasharray="5 3"
                opacity="0.9"
              />
              <text x={PAD.left + chartW + 8} y={y - (isMobile ? 3 : 5)} fill={t.color} fontSize={isMobile ? 7 : 9} fontWeight="700" fontFamily="Tinos, Times New Roman, Times, serif">
                {t.label}
              </text>
              <text x={PAD.left + chartW + 8} y={y + (isMobile ? 6 : 8)} fill={t.color} fontSize={isMobile ? 6 : 8} fontFamily="Tinos, Times New Roman, Times, serif" opacity="0.8">
                {isMobile ? t.pct : `${formatPrice(t.price)} ${t.pct}`}
              </text>
            </g>
          )
        })}

        <line
          x1={PAD.left + chartW - 8}
          y1={toY(pattern.currentPrice)}
          x2={PAD.left + chartW - 8}
          y2={toY(pattern.upsideTarget) + 4}
          stroke={BULL}
          strokeWidth="1.5"
          markerEnd="url(#arrUp)"
          opacity="0.7"
        />
        <line
          x1={PAD.left + chartW - 20}
          y1={toY(pattern.currentPrice)}
          x2={PAD.left + chartW - 20}
          y2={toY(pattern.downsideTarget) - 4}
          stroke={BEAR}
          strokeWidth="1.5"
          markerEnd="url(#arrDn)"
          opacity="0.7"
        />

        <rect x={PAD.left + 6} y={PAD.top + chartH - (isMobile ? 22 : 28)} width={badgeWidth} height={isMobile ? 18 : 22} rx="6" fill="#111118cc" stroke={biasColor} strokeOpacity="0.5" />
        <text x={PAD.left + 14} y={PAD.top + chartH - (isMobile ? 9 : 13)} fill={biasColor} fontSize={isMobile ? 8 : 10} fontWeight="600">
          {pattern.pattern}
        </text>

        <text x={PAD.left} y={chartHeight - 8} fill={MUTED} fontSize={isMobile ? 7 : 9} fontFamily="Tinos, Times New Roman, Times, serif">
          {pattern.resolution}
        </text>
        <text x={PAD.left + chartW - (isMobile ? 36 : 60)} y={chartHeight - 8} fill={MUTED} fontSize={isMobile ? 7 : 9}>
          Now →
        </text>
      </svg>
    </div>
  )
}