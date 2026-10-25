import React from 'react'
import { Outlet } from 'react-router-dom'
import { SkipLink } from '@/components/ui/SkipLink'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'

export interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-espresso-900 selection:bg-terracotta-100 selection:text-espresso-900">
      {/* 1. SkipLink first */}
      <SkipLink targetId="main">Skip to main content</SkipLink>

      {/* 2. Route announcer for screen readers and scroll restoration */}
      <RouteAnnouncer />

      {/* 3. Header landmark with Logo, Nav, Currency, and Bag */}
      <Header />

      {/* 4. Main landmark with tabIndex={-1} for programmatic focus */}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children ?? <Outlet />}
      </main>

      {/* 5. Footer landmark */}
      <Footer />
    </div>
  )
}

export default Layout
