import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Torch?',
    a: 'Torch is a free pattern scanner for Lighter DEX perpetual markets. It detects bullish and bearish chart patterns across all tokens and shows upside/downside price targets.',
  },
  {
    q: 'Which patterns are detected?',
    a: 'StockCharts candlestick patterns (Hammer, Engulfing, Morning Star, etc.) plus chart formations like Double Bottom, Head & Shoulders, Flags, and Triangles.',
  },
  {
    q: 'What timeframe is used?',
    a: 'Pick 15m, 30m, 1h, 4h, 12h, or 1d — and 60, 120, or 180 candles. Top markets use live candle data from Lighter API.',
  },
  {
    q: 'Do I need a wallet?',
    a: 'No. Torch is read-only — no wallet, no API key, no account. Just open the scanner.',
  },
  {
    q: 'What does 70% confidence mean?',
    a: 'Higher confidence means a stronger pattern match based on candle structure and price action. Default filter shows ≥70% patterns first.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-14 sm:py-20 bg-surface-raised/40">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">FAQ</h2>
          <p className="text-sm text-muted">Common questions about Torch.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="glass rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-overlay/40"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-muted shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <p className="px-5 pb-4 text-sm text-muted leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}