import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './Logo'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Patterns', href: '/#patterns' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'FAQ', href: '/#faq' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isScanner = location.pathname === '/patterns'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-subtle/80"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 gap-3">
        <Logo />

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href : `/${link.href.slice(1)}`}
              className="text-sm text-muted hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <Link
            to="/patterns"
            className={`text-sm font-medium px-4 py-2 rounded-xl ${
              isScanner
                ? 'bg-accent/12 text-accent border border-accent/25'
                : 'bg-accent text-surface hover:bg-accent-dim hover:shadow-[0_0_20px_var(--color-accent-glow)]'
            }`}
          >
            Open Scanner
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/patterns"
            className={`text-xs font-medium px-3 py-2 rounded-lg shrink-0 ${
              isScanner
                ? 'bg-accent/12 text-accent border border-accent/25'
                : 'bg-accent text-surface'
            }`}
          >
            Scanner
          </Link>
          <button
            className="p-2 text-muted hover:text-white rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-border-subtle"
          >
            <div className="px-4 py-4 space-y-1" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={isHome ? link.href : `/${link.href.slice(1)}`}
                  className="block text-sm text-muted hover:text-white py-3 px-2 rounded-lg hover:bg-surface-overlay"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}