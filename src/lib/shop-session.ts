/**
 * Session storage manager for preserving user shopping state across page navigations.
 * Remembers active category, sort, last viewed product, and in-shop status
 * so customers return to exactly where they left off instead of restarting from the top.
 */

export interface ShopSessionState {
  category?: string
  sort?: 'featured' | 'price-asc' | 'price-desc'
  lastProductSlug?: string
  inShop?: boolean
  returningFromPdp?: boolean
  scrollY?: number
}

const STORAGE_KEY = 'neko_shop_session_v1'

// Fallback in-memory cache if sessionStorage is disabled/restricted
let memoryCache: ShopSessionState = {}

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const testKey = '__storage_test__'
    window.sessionStorage.setItem(testKey, testKey)
    window.sessionStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function getShopSession(): ShopSessionState {
  if (!isStorageAvailable()) return memoryCache
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return memoryCache
    const parsed = JSON.parse(raw) as ShopSessionState
    return { ...memoryCache, ...parsed }
  } catch {
    return memoryCache
  }
}

export function saveShopSession(patch: Partial<ShopSessionState>): void {
  const current = getShopSession()
  const next: ShopSessionState = { ...current, ...patch }
  memoryCache = next

  if (!isStorageAvailable()) return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota or privacy sandbox error
  }
}

export function clearShopSession(): void {
  memoryCache = {}
  if (!isStorageAvailable()) return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

export function markInShop(inShop: boolean): void {
  saveShopSession({ inShop })
}

export function markReturningFromPdp(returning: boolean): void {
  saveShopSession({ returningFromPdp: returning, inShop: true })
}

export function saveLastViewedProduct(slug: string): void {
  saveShopSession({
    lastProductSlug: slug,
    inShop: true,
    returningFromPdp: true,
  })
}
