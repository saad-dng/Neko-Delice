import { Link } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { PRODUCT_SLUGS, PRODUCT_META } from '@/data/slugs'

export function ShopPage() {
  return (
    <>
      <SeoHead
        title="Shop Collection | NEKO DELICE"
        description="Browse vet-informed nutrition, treats, and quiet hardware thoughtfully crafted for every stage of cat life."
        path="/shop"
      />

      <Section>
        <Container>
          <div className="max-w-2xl mb-10 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
              Catalog
            </p>
            <Heading level={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4">
              Shop the collection
            </Heading>
            <p className="text-base sm:text-lg text-espresso-700 leading-relaxed">
              Vet-informed nutrition and quiet hardware for every stage of cat life. Ten intentional products, made without fillers or guesswork.
            </p>
          </div>

          {/* Product Grid Stub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {PRODUCT_SLUGS.map((slug) => {
              const item = PRODUCT_META[slug]
              return (
                <Link
                  key={slug}
                  to={`/product/${slug}`}
                  className="group block p-6 rounded-2xl bg-oat-100/50 hover:bg-oat-100 border border-oat-200/80 hover:border-oat-300 transition-all hover:shadow-xs"
                >
                  <span className="inline-block px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase text-espresso-700 bg-cream-50 rounded-full border border-oat-200 mb-3">
                    {item.category}
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-espresso-900 group-hover:text-terracotta-700 transition-colors mb-2">
                    {item.name}
                  </h2>
                  <p className="text-xs text-espresso-600 line-clamp-2 leading-relaxed">
                    {item.short}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-terracotta-700 mt-4">
                    View product <span aria-hidden="true">→</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ShopPage
