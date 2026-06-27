import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart2, Flame, Clock } from 'lucide-react'
import { getTimeframeLabel } from '../constants/chart'

const stats = [
  { value: '200+', label: 'Lighter Perps' },
  { value: '15m–1d', label: 'Timeframes' },
  { value: '30+', label: 'Patterns' },
  { value: '≥70%', label: 'High Confidence' },
]

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

export function Hero() {
  return (
    <section className="relative min-h-[80vh] sm:min-h-[88vh] lg:min-h-[92vh] flex items-center pt-14 overflow-hidden">
      <div className="glow-orb top-24 left-1/3 h-80 w-80 bg-accent/8 animate-pulse-glow" />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 w-full">
        <motion.div {...fade} transition={{ duration: 0.5 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-3.5 py-1 text-sm text-accent mb-7">
            <Flame className="h-3.5 w-3.5" />
            Lighter Pattern Scanner
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] mb-5">
            Light up every{' '}
            <span className="text-gradient">Lighter</span>
            <br />
            chart pattern
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-lg mb-9 leading-relaxed">
            Torch scans all Lighter perp tokens for bullish & bearish patterns —
            with clear upside/downside targets on live candles — 15m to 1d, 60–180 bars.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-14">
            <Link
              to="/patterns"
              className="inline-flex items-center justify-center gap-2 bg-accent text-surface font-semibold px-6 py-3 rounded-xl hover:bg-accent-dim hover:shadow-[0_0_24px_var(--color-accent-glow)]"
            >
              Open Scanner
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#patterns"
              className="inline-flex items-center justify-center gap-2 border border-border-subtle text-white/90 font-medium px-6 py-3 rounded-xl hover:bg-surface-overlay hover:border-border"
            >
              <BarChart2 className="h-4 w-4" />
              All Patterns
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              >
                <div className="text-lg sm:text-xl font-bold font-mono text-accent">{stat.value}</div>
                <div className="text-xs text-muted mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-[380px]"
        >
          <div className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Live Scan</span>
              <span className="flex items-center gap-1.5 text-xs text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Active
              </span>
            </div>
            {[
              { token: 'BTC', pattern: 'Bullish Engulfing', up: '+4.2%', conf: '78%' },
              { token: 'ETH', pattern: 'Ascending Triangle', up: '+3.8%', conf: '73%' },
              { token: 'SOL', pattern: 'Morning Star', up: '+6.1%', conf: '80%' },
            ].map((row) => (
              <div key={row.token} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
                <div>
                  <div className="text-sm font-medium">{row.token} <span className="text-muted font-normal text-xs">PERP</span></div>
                  <div className="text-xs text-accent/90 mt-0.5">{row.pattern}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-accent">{row.up}</div>
                  <div className="text-xs text-muted">{row.conf}</div>
                </div>
              </div>
            ))}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <Clock className="h-3 w-3 text-accent/70" />
              {getTimeframeLabel()}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}