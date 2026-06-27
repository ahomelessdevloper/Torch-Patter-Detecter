import { motion } from 'framer-motion'
import { BarChart2, MousePointerClick, Target } from 'lucide-react'

const steps = [
  { step: '01', icon: BarChart2, title: 'Open Scanner', description: 'All Lighter perp tokens load automatically from live market data.' },
  { step: '02', icon: MousePointerClick, title: 'Filter & Search', description: '70%+ confidence on top. Filter bullish, bearish, or search by symbol.' },
  { step: '03', icon: Target, title: 'View Chart', description: 'Click any token — candle chart, pattern zone, upside/downside targets.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-surface-raised/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">How it works</h2>
          <p className="text-sm text-muted">Three steps. No signup.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/15 mb-4">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="text-xs font-mono text-accent mb-1.5">{item.step}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}