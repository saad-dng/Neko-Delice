import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { getShopSession } from '@/lib/shop-session'

export function ShopPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const session = getShopSession()
    const category = searchParams.get('category') || session.category
    const targetAnchor = session.lastProductSlug
      ? `product-${session.lastProductSlug}`
      : 'shop'
    const dest = category
      ? `/?category=${encodeURIComponent(category)}#${targetAnchor}`
      : `/#${targetAnchor}`
    navigate(dest, { replace: true })
  }, [navigate, searchParams])

  return (
    <>
      <SeoHead
        title="Shop the Collection | NEKO DELICE"
        description="Explore our ten intentional items of honest cat nutrition and quiet hardware."
        path="/shop"
      />
      <div className="py-24 text-center">
        <h1 className="sr-only">Shop the collection</h1>
        <p className="text-espresso-700">Redirecting to the collection...</p>
      </div>
    </>
  )
}

export default ShopPage
