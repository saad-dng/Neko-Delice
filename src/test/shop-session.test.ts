import { describe, it, expect, beforeEach } from 'vitest'
import {
  getShopSession,
  saveShopSession,
  clearShopSession,
  markInShop,
  markReturningFromPdp,
  saveLastViewedProduct,
} from '@/lib/shop-session'

describe('Shop session state manager', () => {
  beforeEach(() => {
    clearShopSession()
  })

  it('starts with empty session by default', () => {
    const session = getShopSession()
    expect(session.category).toBeUndefined()
    expect(session.inShop).toBeUndefined()
    expect(session.lastProductSlug).toBeUndefined()
  })

  it('saves and retrieves shopping state accurately', () => {
    saveShopSession({
      category: 'wet-food',
      sort: 'price-asc',
      inShop: true,
    })

    const session = getShopSession()
    expect(session.category).toBe('wet-food')
    expect(session.sort).toBe('price-asc')
    expect(session.inShop).toBe(true)
  })

  it('merges partial updates without overwriting existing keys', () => {
    saveShopSession({ category: 'dry-food' })
    saveShopSession({ sort: 'price-desc' })

    const session = getShopSession()
    expect(session.category).toBe('dry-food')
    expect(session.sort).toBe('price-desc')
  })

  it('records last viewed product and sets returning flags', () => {
    saveLastViewedProduct('wild-salmon-quail-pate')

    const session = getShopSession()
    expect(session.lastProductSlug).toBe('wild-salmon-quail-pate')
    expect(session.inShop).toBe(true)
    expect(session.returningFromPdp).toBe(true)
  })

  it('marks in-shop and returning flags cleanly', () => {
    markInShop(true)
    expect(getShopSession().inShop).toBe(true)

    markReturningFromPdp(false)
    expect(getShopSession().returningFromPdp).toBe(false)
  })

  it('clears all session state on clearShopSession', () => {
    saveShopSession({ category: 'litter', lastProductSlug: 'plant-tofu-litter' })
    clearShopSession()

    const session = getShopSession()
    expect(session.category).toBeUndefined()
    expect(session.lastProductSlug).toBeUndefined()
  })
})
