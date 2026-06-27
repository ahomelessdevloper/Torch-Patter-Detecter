import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle py-8 sm:py-10 mt-4 sm:mt-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" />

          <div className="flex gap-6 text-sm text-muted">
            <Link to="/patterns" className="hover:text-white">
              Scanner
            </Link>
            <a href="https://lighter.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Lighter DEX
            </a>
            <a href="https://docs.lighter.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Docs
            </a>
          </div>

          <p className="text-xs text-muted">
            © 2026 Torch · Not affiliated with Lighter.xyz
          </p>
        </div>
      </div>
    </footer>
  )
}