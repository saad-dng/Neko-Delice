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
    <footer className="bg-oat-100/70 border-t border-sand-300/80 mt-auto pt-16 pb-12 text-espresso-800">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 pb-12 border-b border-sand-300/70">
          {/* 1. Brand Identity */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col items-start gap-3">
            <Logo variant="stacked" />
            <p className="text-base text-espresso-950 font-medium mt-1">
              Honest food, quiet design.
            </p>
            <p className="text-sm text-espresso-800 leading-relaxed max-w-sm">
              Formulated with single-source animal proteins and no fillers. Clear portions and balanced nutrition for loving cat homes.
            </p>
          </div>

          {/* 2. Navigation */}
          <div className="md:col-span-3 lg:col-span-3">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-espresso-950 mb-4">
              Navigation
            </h2>
            <nav aria-label="Footer Navigation" className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="footer-hover-link py-0.5 text-[15px] sm:text-[16px] font-medium text-espresso-800 hover:text-espresso-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-xs transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 3. Care & Standards */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-espresso-950 mb-4">
              Care &amp; Standards
            </h2>
            <p className="text-sm text-espresso-800 leading-relaxed">
              Feeding recommendations are supportive estimates for healthy cats. Check with your vet for medical conditions, pregnancy, or rapid weight changes.
            </p>
            <p className="text-sm text-espresso-800 leading-relaxed">
              NEKO DELICE is committed to digital accessibility. We conform to WCAG 2.1 AA standards so every cat companion can navigate with ease.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Currency Selector, and Creator Credit */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-sm text-espresso-800">
          <p className="text-center md:text-left">
            © {currentYear} NEKO DELICE. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2.5">
            <span className="text-[13px] uppercase tracking-wider font-semibold text-espresso-800">
              Currency:
            </span>
            <CurrencyToggle ariaLabel="Currency selection" size="xs" />
          </div>

          <p className="text-espresso-800 flex items-center justify-center md:justify-end gap-1.5">
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
              className="footer-hover-link font-semibold text-espresso-950 hover:text-terracotta-600 pb-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-xs transition-colors"
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
