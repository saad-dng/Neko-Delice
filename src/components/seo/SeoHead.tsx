import { Head } from 'vite-react-ssg'
import cormorant600Url from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2'

export interface SeoHeadProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article' | 'product'
  imagePreload?: {
    src: string
    srcset?: string
    sizes?: string
  }
  jsonLd?: Record<string, unknown>
}

const DEFAULT_SITE_URL = 'https://example.com'

function getSiteUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
    return (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, '')
  }
  return DEFAULT_SITE_URL
}

export function SeoHead({
  title,
  description,
  path,
  type = 'website',
  imagePreload,
  jsonLd,
}: SeoHeadProps) {
  const siteUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const canonicalUrl = `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="NEKO DELICE" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Favicon & Touch Icon from P05 */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Font Preload for LCP typography (Cormorant Garamond 600 WOFF2) */}
      <link
        rel="preload"
        href={cormorant600Url}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Hero Image Preload for PDP LCP */}
      {imagePreload && (
        <link
          rel="preload"
          as="image"
          href={imagePreload.src}
          imageSrcSet={imagePreload.srcset}
          imageSizes={imagePreload.sizes}
          fetchPriority="high"
        />
      )}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Head>
  )
}


export default SeoHead
