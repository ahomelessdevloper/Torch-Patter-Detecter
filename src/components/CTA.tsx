import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="glass rounded-2xl p-8 sm:p-14 text-center border-accent/15"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Start scanning</h2>
          <p className="text-sm text-muted max-w-sm mx-auto mb-7">
            200+ tokens. Live patterns. Free, instant, no login.
          </p>
          <Link
            to="/patterns"
            className="inline-flex items-center gap-2 bg-accent text-surface font-semibold px-7 py-3 rounded-xl hover:bg-accent-dim hover:shadow-[0_0_24px_var(--color-accent-glow)]"
          >
            Open Scanner
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}