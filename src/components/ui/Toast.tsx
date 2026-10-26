import { useEffect, useRef, useState } from 'react'
import { useToast, type ToastItem } from '@/store/toast'
import { PawPrint } from '@/components/cat-art/PawPrint'

interface ToastViewProps {
  item: ToastItem
  onDismiss: () => void
}

function ToastView({ item, onDismiss }: ToastViewProps) {
  const [isUndone, setIsUndone] = useState(false)
  const remainingRef = useRef<number>(item.durationMs ?? 5000)
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    remainingRef.current = item.durationMs ?? 5000
    startTimeRef.current = Date.now()

    timerRef.current = setTimeout(() => {
      onDismiss()
    }, remainingRef.current)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [item, onDismiss])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handlePause = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
        const elapsed = Date.now() - startTimeRef.current
        remainingRef.current = Math.max(500, remainingRef.current - elapsed)
      }
    }

    const handleResume = () => {
      startTimeRef.current = Date.now()
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onDismiss()
      }, remainingRef.current)
    }

    el.addEventListener('mouseenter', handlePause)
    el.addEventListener('mouseleave', handleResume)
    el.addEventListener('focusin', handlePause)
    el.addEventListener('focusout', handleResume)

    return () => {
      el.removeEventListener('mouseenter', handlePause)
      el.removeEventListener('mouseleave', handleResume)
      el.removeEventListener('focusin', handlePause)
      el.removeEventListener('focusout', handleResume)
    }
  }, [onDismiss])

  const handleUndo = () => {
    if (item.undoAction) {
      item.undoAction()
      setIsUndone(true)
      setTimeout(() => {
        onDismiss()
      }, 1200)
    }
  }

  return (
    <aside
      ref={containerRef}
      aria-label="Notification"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto animate-toast-in motion-reduce:animate-none"
      style={{ willChange: 'transform, opacity' }}
    >
      <output
        aria-live="polite"
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-cream-50/96 text-espresso-950 border border-sand-300/90 shadow-lg backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sage-100 text-sage-800 shrink-0">
            <PawPrint size={14} filled className="text-sage-700" />
          </span>
          <span className="text-xs sm:text-sm font-medium text-espresso-950 truncate">
            {isUndone ? 'Addition undone.' : item.message}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isUndone && item.undoAction && (
            <button
              type="button"
              onClick={handleUndo}
              className="px-2.5 py-1 text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 hover:bg-terracotta-50 active:scale-95 rounded-lg underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
            >
              Undo
            </button>
          )}

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="p-1 rounded-full text-espresso-600 hover:text-espresso-950 hover:bg-oat-200/70 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </output>
    </aside>
  )
}

export function Toast() {
  const current = useToast((s) => s.current)
  const hideToast = useToast((s) => s.hideToast)

  if (!current) return null

  return <ToastView key={current.id} item={current} onDismiss={hideToast} />
}

export default Toast
