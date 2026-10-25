import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'

export function ShopPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const category = searchParams.get('category')
    const dest = category ? `/?category=${encodeURIComponent(category)}#shop` : '/#shop'
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
