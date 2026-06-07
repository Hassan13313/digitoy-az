import { useEffect } from 'react'

export const SITE_URL = 'https://digitoy.az'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  if (!href) return
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/* ── Route-aware SEO: title, meta description, canonical, OG, Twitter Card ──
   SPA-da react-router/helmet olmadığı üçün <head>-i birbaşa idarə edir.
   Statik JSON-LD (Organization/WebSite/Service) index.html-də qalır —
   crawler-lər JS icra etmədən də onu görsün deyə. */
export function useSEO({ title, description, path = '/', image, type = 'website', noindex = false }) {
  useEffect(() => {
    if (title) document.title = title

    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')

    const url = `${SITE_URL}${path}`
    const ogImage = image || DEFAULT_OG_IMAGE

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', 'DigiToy')
    setMeta('property', 'og:locale', 'az_AZ')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)

    if (!noindex) setCanonical(url)
  }, [title, description, path, image, type, noindex])
}
