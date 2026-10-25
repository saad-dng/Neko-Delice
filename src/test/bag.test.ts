import { beforeEach, describe, expect, it } from 'vitest'
import { useBag } from '@/store/bag'
import { useBagUi } from '@/store/bag-ui'
import { safeLocalStorage } from '@/store/safe-storage'

describe('useBag store & safeLocalStorage (P13)', () => {
  beforeEach(() => {
    useBag.getState().clear()
    useBagUi.getState().closeBag()
    localStorage.clear()
  })

  it('starts with an empty bag and 0 count', () => {
    expect(useBag.getState().lines).toEqual([])
    expect(useBag.getState().count()).toBe(0)
  })

  it('adds items, clamps quantities between 1 and 9, and increments count', () => {
    const bag = useBag.getState()
    bag.add('01', 2)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 2 }])
    expect(useBag.getState().count()).toBe(2)

    // Adding more to same product merges quantity
    bag.add('01', 3)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 5 }])
    expect(useBag.getState().count()).toBe(5)

    // Clamps at 9
    bag.add('01', 10)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 9 }])
    expect(useBag.getState().count()).toBe(9)
  })

  it('addMany correctly merges items and respects max 9 clamp', () => {
    const bag = useBag.getState()
    bag.add('01', 2)

    bag.addMany([
      { productId: '01', qty: 3 }, // 2 + 3 = 5
      { productId: '02', qty: 4 }, // new line
      { productId: '03', qty: 12 }, // new line clamped to 9
    ])

    const lines = useBag.getState().lines
    expect(lines.find((l) => l.productId === '01')?.qty).toBe(5)
    expect(lines.find((l) => l.productId === '02')?.qty).toBe(4)
    expect(lines.find((l) => l.productId === '03')?.qty).toBe(9)
    expect(useBag.getState().count()).toBe(18)
  })

  it('setQty updates, clamps, and removes on 0', () => {
    const bag = useBag.getState()
    bag.add('01', 3)
    bag.setQty('01', 7)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 7 }])

    // Setting to 0 removes line
    bag.setQty('01', 0)
    expect(useBag.getState().lines).toEqual([])
  })

  it('removes item by ID', () => {
    const bag = useBag.getState()
    bag.add('01', 2)
    bag.add('02', 1)
    bag.remove('01')
    expect(useBag.getState().lines).toEqual([{ productId: '02', qty: 1 }])
  })

  it('safeLocalStorage handles corrupted or invalid JSON safely without throwing', () => {
    localStorage.setItem('neko-delice-bag-v1', '{invalid-json:::malformed!')
    const retrieved = safeLocalStorage.getItem('neko-delice-bag-v1')
    // safeLocalStorage catches the parse error, purges corrupted key, and returns null
    expect(retrieved).toBeNull()
    expect(localStorage.getItem('neko-delice-bag-v1')).toBeNull()

    // Setting corrupt JSON or calling safeLocalStorage methods never throws
    expect(() => {
      safeLocalStorage.setItem('test-key', 'valid')
      safeLocalStorage.removeItem('test-key')
    }).not.toThrow()
  })

  it('useBagUi tracks isOpen and trigger element', () => {
    const bagUi = useBagUi.getState()
    expect(bagUi.isOpen).toBe(false)
    expect(bagUi.triggerElement).toBeNull()

    const dummyButton = document.createElement('button')
    bagUi.openBag(dummyButton)
    expect(useBagUi.getState().isOpen).toBe(true)
    expect(useBagUi.getState().triggerElement).toBe(dummyButton)

    bagUi.closeBag()
    expect(useBagUi.getState().isOpen).toBe(false)
  })
})
