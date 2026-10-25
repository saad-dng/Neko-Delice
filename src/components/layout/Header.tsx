import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Icon } from '@/components/ui/Icon'
import { useBag } from '@/store/bag'
import { useBagUi } from '@/store/bag-ui'
import { useCurrency } from '@/store/currency'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const currency = useCurrency((s) => s.currency)
  const bagCount = useBag((s) => s.lines.reduce((total, l) => total + l.qty, 0))

  const [isBouncing, setIsBouncing] = useState(false)
  const prevCountRef = useRef(bagCount)
  const setCurrency = useCurrency((s) => s.setCurrency)
  const openBag = useBagUi((s) => s.openBag)

  // Trigger bounce animation when bagCount increments
  useEffect(() => {
    if (bagCount > prevCountRef.current) {
      setIsBouncing(true)
      const timer = setTimeout(() => setIsBouncing(false), 380)
      prevCountRef.current = bagCount
      return () => clearTimeout(timer)
    }
    prevCountRef.current = bagCount
  }, [bagCount])

  // Close mobile menu when navigating
  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/meal-plan', label: 'Meal Planner' },
    { to: '/about', label: 'About' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-oat-200/80 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <Logo variant="compact" />
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-full transition-colors min-h-[44px] inline-flex items-center ${
                  isActive
                    ? 'text-terracotta-600 font-semibold'
                    : 'text-espresso-800 hover:text-espresso-900 hover:bg-oat-100/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Actions (Currency toggle + Bag button + Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Segmented Control */}
          <fieldset
            aria-label="Currency selection"
            className="hidden sm:inline-flex items-center rounded-full bg-oat-100 p-0.5 border border-sand-300/60 m-0"
          >
            <legend className="sr-only">Currency selection</legend>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              aria-pressed={currency === 'USD'}
              className={`min-w-[40px] min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-cream-50 text-espresso-950 shadow-xs'
                  : 'text-espresso-600 hover:text-espresso-950'
              }`}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('BDT')}
              aria-pressed={currency === 'BDT'}
              className={`min-w-[40px] min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                currency === 'BDT'
                  ? 'bg-cream-50 text-espresso-950 shadow-xs'
                  : 'text-espresso-600 hover:text-espresso-950'
              }`}
            >
              BDT
            </button>
          </fieldset>

          {/* Bag Button with Bounce Animation */}
          <button
            type="button"
            onClick={(e) => openBag(e.currentTarget)}
            aria-label={`Open bag, ${bagCount} items`}
            className={`relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-espresso-900 bg-oat-100/70 hover:bg-oat-200/80 rounded-full border border-oat-300/40 transition-transform cursor-pointer ${
              isBouncing ? 'animate-bag-bounce' : ''
            }`}
          >
            <Icon name="bag" size={20} />
            <span
              className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-cream-50 bg-terracotta-600 rounded-full border border-cream-50 tabular-nums ${
                isBouncing ? 'scale-110' : ''
              }`}
              aria-hidden="true"
            >
              {bagCount}
            </span>
          </button>

          {/* Mobile Menu Disclosure Button */}
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-espresso-900 rounded-full hover:bg-oat-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <Icon name="close" size={22} />
            ) : (
              <svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Disclosure Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-oat-200/70 bg-cream-50/98 px-4 pt-3 pb-6 shadow-sm transition-all"
        >
          <nav aria-label="Mobile Primary" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `px-4 py-3 text-base rounded-xl min-h-[44px] flex items-center justify-between transition-colors ${
                    isActive || location.pathname === link.to
                      ? 'bg-oat-200/70 text-terracotta-600 font-semibold'
                      : 'text-espresso-800 hover:bg-oat-100 hover:text-espresso-900 font-medium'
                  }`
                }
              >
                <span>{link.label}</span>
                <span className="text-espresso-400 text-sm">→</span>
              </NavLink>
            ))}

            <div className="pt-3 mt-2 border-t border-oat-200/60 flex items-center justify-between px-2">
              <span className="text-xs text-espresso-700">Display Currency</span>
              <fieldset
                aria-label="Mobile currency selection"
                className="inline-flex rounded-full bg-oat-200/70 p-0.5 border border-sand-300/60 m-0"
              >
                <legend className="sr-only">Mobile currency selection</legend>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  aria-pressed={currency === 'USD'}
                  className={`min-w-[40px] min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-cream-50 text-espresso-950 shadow-xs'
                      : 'text-espresso-600 hover:text-espresso-950'
                  }`}
                >
                  USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('BDT')}
                  aria-pressed={currency === 'BDT'}
                  className={`min-w-[40px] min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    currency === 'BDT'
                      ? 'bg-cream-50 text-espresso-950 shadow-xs'
                      : 'text-espresso-600 hover:text-espresso-950'
                  }`}
                >
                  BDT
                </button>
              </fieldset>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}


export default Header
