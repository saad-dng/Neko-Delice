import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SkipLink } from '@/components/ui/SkipLink'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import { SmartBag } from '@/components/bag/SmartBag'
import { Toast } from '@/components/ui/Toast'

export interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevPathRef = useRef(location.pathname)

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname
      setIsTransitioning(true)
      const timer = setTimeout(() => setIsTransitioning(false), 150)
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-espresso-900 selection:bg-terracotta-100 selection:text-espresso-900">
      {/* 1. SkipLink first */}
      <SkipLink targetId="main">Skip to main content</SkipLink>

      {/* 2. Route announcer for screen readers and scroll restoration */}
      <RouteAnnouncer />

      {/* 3. Header landmark with Logo, Nav, Currency, and Bag */}
      <Header />

      {/* 4. Main landmark with tabIndex={-1} for programmatic focus and 150ms opacity transition */}
      <main
        id="main"
        tabIndex={-1}
        className={`flex-1 focus:outline-none route-transition ${
          isTransitioning ? 'opacity-70' : 'opacity-100'
        }`}
      >
        {children ?? <Outlet />}
      </main>

      {/* 5. SmartBag dialog modal */}
      <SmartBag />

      {/* 6. Non-blocking polite Add to Bag Toast */}
      <Toast />

      {/* 7. Footer landmark */}
      <Footer />
    </div>
  )
}

export default Layout

