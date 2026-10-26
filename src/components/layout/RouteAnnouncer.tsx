import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getShopSession } from '@/lib/shop-session'

/**
 * RouteAnnouncer handles:
 * 1. Scroll restoration on navigation (scrollTo top, or smooth scroll to hash element if present)
 * 2. Moving programmatic focus to the primary page h1 (when not navigating to an anchor)
 * 3. Announcing page title changes to screen readers via an aria-live="polite" live region
 */
export function RouteAnnouncer() {
  const location = useLocation()
  const [announcement, setAnnouncement] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Scroll restoration or hash anchor scrolling
    if (typeof window !== 'undefined') {
      if (location.hash) {
        const id = location.hash.replace('#', '')
        let attempts = 0
        const tryScroll = () => {
          const el = document.getElementById(id)
          if (el) {
            const prefersReducedMotion = window.matchMedia(
              '(prefers-reduced-motion: reduce)'
            ).matches
            el.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            })
          } else if (attempts < 12) {
            attempts++
            requestAnimationFrame(tryScroll)
          } else {
            window.scrollTo(0, 0)
          }
        }
        requestAnimationFrame(tryScroll)
      } else {
        // If returning to homepage while actively shopping or returning from PDP,
        // do not force window.scrollTo(0,0) - let HomePage restore the user's position
        const session = getShopSession()
        const isReturningToShop =
          location.pathname === '/' &&
          (session.returningFromPdp || (session.inShop && session.lastProductSlug))

        if (!isReturningToShop) {
          window.scrollTo(0, 0)
        }
      }
    }

    // Skip announcement on initial SSR/hydration load to avoid duplicate reading
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Delay to allow the new page component to mount and document.title to update
    const timer = setTimeout(() => {
      const h1 = (document.querySelector('main h1') || document.querySelector('h1')) as HTMLElement | null
      const pageTitle = document.title || h1?.textContent?.trim() || 'Page loaded'

      setAnnouncement(pageTitle)

      if (h1 && !location.hash) {
        if (!h1.hasAttribute('tabindex')) {
          h1.setAttribute('tabindex', '-1')
        }
        h1.focus({ preventScroll: true })
      }
    }, 60)

    return () => clearTimeout(timer)
  }, [location.pathname, location.hash])

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
