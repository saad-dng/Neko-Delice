import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

export interface RevealOptions {
  threshold?: number
  delay?: number
  disabled?: boolean
}

function checkImmediateReveal(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return true
  if (!('IntersectionObserver' in window)) return true
  return false
}

const emptySubscribe = () => () => {}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  delay = 0,
  disabled = false,
}: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const [intersected, setIntersected] = useState(false)

  useEffect(() => {
    if (disabled || !isClient || checkImmediateReveal()) {
      return
    }

    const element = ref.current
    if (!element) return

    let timer: ReturnType<typeof setTimeout> | undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              timer = setTimeout(() => {
                setIntersected(true)
              }, delay)
            } else {
              setIntersected(true)
            }
            observer.disconnect()
          }
        })
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [threshold, delay, disabled, isClient])

  const isRevealed = !isClient || disabled || checkImmediateReveal() || intersected

  return { ref, isRevealed }
}

export default useReveal
