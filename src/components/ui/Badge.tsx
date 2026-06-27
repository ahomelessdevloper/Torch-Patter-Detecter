const variants = {
  accent: 'text-accent bg-accent/10 border-accent/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  danger: 'text-danger bg-danger/10 border-danger/20',
  muted: 'text-muted bg-surface-overlay border-border-subtle',
  live: 'text-accent bg-accent/10 border-accent/20',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  dot?: boolean
}

export function Badge({ children, variant = 'muted', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${variants[variant]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
      {children}
    </span>
  )
}