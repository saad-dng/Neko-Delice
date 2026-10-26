import { useEffect } from 'react'
import { HomePage } from './Home'
import { getShopSession } from '@/lib/shop-session'

export function ShopPage() {
  useEffect(() => {
    // Sync URL hash for deep linking and shop session restoration
    const session = getShopSession()
    const targetAnchor = session.lastProductSlug
      ? `product-${session.lastProductSlug}`
      : 'shop'
    const params = new URLSearchParams(window.location.search)
    const category = params.get('category') || session.category
    const dest = category
      ? `/?category=${encodeURIComponent(category)}#${targetAnchor}`
      : `/#${targetAnchor}`

    if (window.location.pathname === '/shop') {
      window.history.replaceState(null, '', dest)
    }
  }, [])

  return <HomePage />
}

export default ShopPage
