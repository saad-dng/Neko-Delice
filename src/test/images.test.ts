import { describe, expect, it } from 'vitest'
import { imageManifest } from '@/data/images.manifest'

describe('Image Manifest & ProductImage', () => {
  const products = Object.values(imageManifest)

  it('contains all 10 products', () => {
    expect(products.length).toBe(10)
  })

  it('every product has cardDefault and cardHover defined', () => {
    for (const product of products) {
      expect(product.cardDefault).toBeDefined()
      expect(product.cardDefault.src).toBeTruthy()
      expect(product.cardHover).toBeDefined()
      expect(product.cardHover.src).toBeTruthy()
    }
  })

  it('every image entry has a non-empty alt text under 140 chars', () => {
    for (const product of products) {
      for (const img of product.gallery) {
        expect(img.alt).toBeTruthy()
        expect(img.alt.trim().length).toBeGreaterThan(0)
        expect(img.alt.length).toBeLessThanOrEqual(140)
      }
    }
  })

  it('every image entry has width, height, and valid srcset entries', () => {
    for (const product of products) {
      for (const img of product.gallery) {
        expect(img.width).toBeGreaterThan(0)
        expect(img.height).toBeGreaterThan(0)
        expect(Object.keys(img.srcset).length).toBeGreaterThan(0)
      }
    }
  })
})
