import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useIsMobile } from '../../hooks/useMediaQuery'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
  xl?: boolean
}

export function Modal({ open, onClose, title, children, wide, xl }: ModalProps) {
  const isMobile = useIsMobile()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div
          className={`fixed inset-0 z-[100] flex ${
            isMobile ? 'items-end justify-center p-0' : 'items-center justify-center p-4'
          }`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.97, y: 6 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative glass w-full ${
              isMobile
                ? 'rounded-t-2xl rounded-b-none max-h-[94vh] border-b-0'
                : 'rounded-2xl max-h-[92vh]'
            } ${
              xl ? 'max-w-3xl' : wide ? 'max-w-lg' : 'max-w-md'
            } overflow-y-auto overscroll-contain`}
            style={isMobile ? { paddingBottom: 'env(safe-area-inset-bottom)' } : undefined}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border-subtle sticky top-0 bg-surface-raised/95 backdrop-blur-md z-10">
              <h2 className="font-semibold text-sm truncate pr-3">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-1 rounded-lg hover:bg-surface-overlay text-muted hover:text-white shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}