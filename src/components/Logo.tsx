import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md'
}

export function Logo({ size = 'md' }: LogoProps) {
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const box = size === 'sm' ? 'h-7 w-7 rounded-lg' : 'h-8 w-8 rounded-xl'
  const text = size === 'sm' ? 'text-xs' : 'text-base'

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`flex ${box} items-center justify-center bg-accent/10 border border-accent/20 group-hover:bg-accent/15 group-hover:border-accent/30 transition-all`}>
        <Flame className={`${icon} text-accent`} />
      </div>
      <span className={`font-semibold ${text} tracking-tight`}>
        Tor<span className="text-accent">ch</span>
      </span>
    </Link>
  )
}