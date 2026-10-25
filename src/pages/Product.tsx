import { useParams, Link } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { isProductSlug, PRODUCT_META } from '@/data/slugs'
import { NotFoundPage } from '@/pages/NotFound'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()

  if (!isProductSlug(slug)) {
    return <NotFoundPage />
  }

  const product = PRODUCT_META[slug]

  return (
    <>
      <SeoHead
        title={`${product.name} | NEKO DELICE`}
        description={product.short}
        path={`/product/${product.slug}`}
        type="product"
      />

      <Section>
        <Container>
          <div className="mb-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso-600 hover:text-terracotta-700 transition-colors py-2"
            >
              <span aria-hidden="true">←</span> Back to collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery Placeholder / Preview stub */}
            <div className="lg:col-span-7 bg-oat-100 rounded-2xl aspect-square flex items-center justify-center p-8 border border-oat-200">
              <span className="text-sm text-espresso-500 font-medium text-center">
                {product.name} — Gallery preview stub (P11)
              </span>
            </div>

            {/* Product Meta & Information */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta-800 bg-terracotta-100/70 rounded-full w-fit">
                {product.category}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 leading-tight">
                {product.name}
              </h1>

              <p className="text-base text-espresso-700 leading-relaxed mt-2">
                {product.short}
              </p>

              <div className="pt-6 border-t border-oat-200/80 mt-2">
                <Button variant="primary" className="w-full sm:w-auto">
                  Add to bag — preview
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ProductPage
