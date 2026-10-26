import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'

export function Footer() {
  const currentYear = 2026

  const footerLinks = [
    { to: '/', label: 'Home' },
    { to: '/#shop', label: 'Shop' },
    { to: '/meal-plan', label: 'Meal Planner' },
    { to: '/about', label: 'About' },
  ]

  return (
    <footer className="bg-oat-100/60 border-t border-oat-200/80 mt-auto pt-16 pb-12 text-espresso-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-oat-300/60">
          {/* Brand Identity & Line */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Logo variant="stacked" />
            <p className="text-base text-espresso-800 font-medium mt-1">
              Honest food, quiet design.
            </p>
            <p className="text-xs text-espresso-600 max-w-sm leading-relaxed">
              Formulated with a vet-informed approach. Clear portions, pure ingredients, and no guesswork for loving cat households.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-espresso-800 mb-4">
              Navigation
            </h2>
            <nav aria-label="Footer Navigation" className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-espresso-800 hover:text-terracotta-600 transition-colors inline-block py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Care & Digital Accessibility Statement */}
          <div className="md:col-span-4 flex flex-col gap-3 text-xs text-espresso-800 leading-relaxed">
            <h2 className="text-xs font-bold uppercase tracking-wider text-espresso-800 mb-1">
              Care &amp; Standards
            </h2>
            <p className="text-espresso-700">
              Formulated with human-grade, single-source animal proteins and zero fillers. Our feeding recommendations are supportive estimates for healthy cats.
            </p>
            <p className="text-espresso-700">
              NEKO DELICE is committed to digital accessibility. We aim to conform to WCAG 2.1 AA standards so every cat companion can navigate with ease.
            </p>
            <p className="text-[11px] text-espresso-600 pt-1 border-t border-oat-300/60">
              Always consult your veterinarian for specialized medical conditions, pregnancy, or rapid weight changes.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Currency Selector, and Creator Credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-espresso-700">
          <p>© {currentYear} NEKO DELICE. All rights reserved.</p>

          {/* Global Store Currency Selector */}
          <div className="flex items-center gap-2.5">
            <span className="text-espresso-800 font-medium">Currency:</span>
            <CurrencyToggle ariaLabel="Currency selection" size="sm" />
          </div>

          <p className="text-espresso-700 flex items-center gap-1.5">
            <span>Made with</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform hover:scale-125 select-none text-[13px]"
            >
              🖤
            </span>
            <span className="sr-only">love</span>
            <span>by</span>
            <a
              href="https://www.instagram.com/saaad.dng/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-espresso-950 underline underline-offset-3 decoration-sand-400 hover:text-terracotta-600 hover:decoration-terracotta-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-xs"
            >
              Saad Bin Kabir
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
