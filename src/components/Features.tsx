import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Search, Clock, Target, Layers } from 'lucide-react'

const features = [
  { icon: BarChart2, title: 'Full Market Scan', description: 'All Lighter perpetual tokens scanned in one place — 200+ markets.' },
  { icon: Layers, title: '30+ Patterns', description: 'Candlestick + chart formations from StockCharts dictionary.' },
  { icon: Target, title: 'Upside / Downside Targets', description: 'Clear upside and downside price levels on every match.' },
  { icon: TrendingUp, title: '70%+ Confidence', description: 'High-confidence patterns surfaced first.' },
  { icon: Clock, title: 'Multi-Timeframe', description: '15m, 30m, 1h, 4h, 12h, 1d — 60, 120, or 180 candles per chart.' },
  { icon: Search, title: 'Click → Chart', description: 'Full candle view with pattern drawing on any token.' },
]

export function Features() {
  return (
    <section id="features" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Features</h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            Clean, fast pattern scanning for Lighter DEX. No wallet needed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="glass rounded-2xl p-5 card-hover"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/15 mb-3">
                <feature.icon className="h-4 w-4 text-accent" />
              </div>
              <h3 className="font-semibold mb-1.5">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}