import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * RouteAnnouncer handles:
 * 1. Scroll restoration on navigation (scrollTo top)
 * 2. Moving programmatic focus to the primary page h1
 * 3. Announcing page title changes to screen readers via an aria-live="polite" live region
 */
export function RouteAnnouncer() {
  const location = useLocation()
  const [announcement, setAnnouncement] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Scroll restoration to top on route navigation
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }

    // Skip announcement on initial SSR/hydration load to avoid duplicate reading
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Slight delay to allow the new page component to mount and document.title to update
    const timer = setTimeout(() => {
      const h1 = (document.querySelector('main h1') || document.querySelector('h1')) as HTMLElement | null
      const pageTitle = document.title || h1?.textContent?.trim() || 'Page loaded'

      setAnnouncement(pageTitle)

      if (h1) {
        if (!h1.hasAttribute('tabindex')) {
          h1.setAttribute('tabindex', '-1')
        }
        h1.focus({ preventScroll: true })
      }
    }, 60)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <output
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="route-announcer"
    >
      {announcement}
    </output>
  )
}

export default RouteAnnouncer
