import { describe, expect, it } from 'vitest'
import { imageManifest } from '@/data/images.manifest'
import { siteImages } from '@/data/site-images.manifest'

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

describe('Site Cat Photography Manifest', () => {
  const siteEntries = Object.values(siteImages)

  it('contains all 6 site photo roles', () => {
    const expectedRoles = ['hero', 'hero-alt', 'eating', 'peek', 'portrait', 'kitten']
    for (const role of expectedRoles) {
      const entry = siteImages[role]
      expect(entry).toBeDefined()
      expect(entry?.role).toBe(role)
    }
    expect(siteEntries.length).toBe(6)
  })

  it('every site image entry has a non-empty alt text without AI mentions', () => {
    for (const img of siteEntries) {
      expect(img.alt).toBeTruthy()
      expect(img.alt.trim().length).toBeGreaterThan(0)
      expect(/\b(ai|artificial)\b/i.test(img.alt)).toBe(false)
      expect(img.alt.toLowerCase()).not.toContain('placeholder')
    }
  })

  it('every site image has valid dimensions and srcset entries', () => {
    for (const img of siteEntries) {
      expect(img.width).toBeGreaterThan(0)
      expect(img.height).toBeGreaterThan(0)
      expect(img.src).toBeTruthy()
      expect(Object.keys(img.srcset).length).toBeGreaterThanOrEqual(3)
    }
  })

  it('hero image includes 2000w srcset resolution', () => {
    const hero = siteImages.hero
    expect(hero).toBeDefined()
    expect(hero?.srcset[2000]).toBeDefined()
    expect(hero?.srcset[2000]).toContain('hero-2000.webp')
  })
})

