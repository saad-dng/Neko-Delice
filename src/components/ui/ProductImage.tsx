import { useState } from 'react'
import { imageManifest } from '@/data/images.manifest'

export interface ProductImageProps {
  slug: string
  role?: string
  sizes?: string
  priority?: boolean
  className?: string
}

export function ProductImage({
  slug,
  role = 'hero',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className = '',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  const product = imageManifest[slug]

  if (!product) {
    return (
      <div
        className={`relative overflow-hidden bg-[#DDD0BA] aspect-square flex items-center justify-center text-[#2B211A]/40 text-xs ${className}`}
        aria-hidden="true"
      >
        <span>Image unavailable</span>
      </div>
    )
  }

  const imageEntry =
    product.images[role] ||
    (role === 'hero' ? product.cardDefault : undefined) ||
    product.gallery.find((g) => g.role === role) ||
    product.cardDefault

  const srcSetString = Object.entries(imageEntry.srcset)
    .map(([w, src]) => `${src} ${w}w`)
    .join(', ')

  if (hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-[#DDD0BA] aspect-square flex items-center justify-center text-[#2B211A]/40 text-xs ${className}`}
      >
        <span className="sr-only">{imageEntry.alt}</span>
        <svg
          className="w-8 h-8 opacity-40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#DDD0BA] aspect-square ${className}`}
    >
      <img
        src={imageEntry.src}
        srcSet={srcSetString}
        sizes={sizes}
        alt={imageEntry.alt}
        width={imageEntry.width}
        height={imageEntry.height}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-opacity duration-200"
      />
    </div>
  )
}

export default ProductImage
