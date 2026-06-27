import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { CANDLESTICK_PATTERNS, CHART_PATTERNS } from '../data/candlePatterns'

export function PatternTypes() {
  const bullish = [...CANDLESTICK_PATTERNS, ...CHART_PATTERNS].filter((p) => p.bias === 'bullish')
  const bearish = [...CANDLESTICK_PATTERNS, ...CHART_PATTERNS].filter((p) => p.bias === 'bearish')

  return (
    <section id="patterns" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Supported patterns</h2>
          <p className="text-sm text-muted">StockCharts dictionary + classic chart formations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-5 card-hover"
          >
            <div className="flex items-center gap-2 text-accent mb-3">
              <TrendingUp className="h-4 w-4" />
              <h3 className="font-semibold">Bullish</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bullish.map((p) => (
                <span key={p.name} className="text-xs px-2 py-0.5 rounded-md bg-accent/8 text-accent/90 border border-accent/15">
                  {p.name}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="glass rounded-2xl p-5 card-hover"
          >
            <div className="flex items-center gap-2 text-danger mb-3">
              <TrendingDown className="h-4 w-4" />
              <h3 className="font-semibold">Bearish</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bearish.map((p) => (
                <span key={p.name} className="text-xs px-2 py-0.5 rounded-md bg-danger/8 text-danger/90 border border-danger/15">
                  {p.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <Link to="/patterns" className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-soft">
            Scan all tokens
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}