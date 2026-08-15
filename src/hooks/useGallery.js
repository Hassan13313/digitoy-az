import { useCallback, useMemo } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   useGallery — foto qalereya / QR paylaşım məntiqi (UI-sız).

   simple-luxury şablonundan (əvvəlki InvitationPage.jsx) çıxarılıb:
   slug hesablanması, foto-paylaşım URL-i, masa kartı SVG generatoru.
   SVG məzmunu hərf-hərf eynidir — endirilən fayl dəyişmir.
   ───────────────────────────────────────────────────────────────────────── */

/* Ad → URL slug (BuilderForm.toSlug ilə eyni) */
export function toSlug(str = '') {
  return str.toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/[ışı]/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'davetname'
}

export function useGallery({ weddingData, isCouple, isCorp }) {
  /* URL-dəki slug prioritetlidir; yoxdursa adlardan hesablanır (preview rejimi) */
  const pageSlug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || ''

  const effectiveSlug = useMemo(() => (
    pageSlug || (
      isCouple
        ? `${toSlug(weddingData?.brideName || '')}-ve-${toSlug(weddingData?.groomName || '')}`
        : isCorp
          ? toSlug(weddingData?.eventName || 'tedbir')
          : toSlug(weddingData?.brideName || 'davetname')
    )
  ), [pageSlug, weddingData, isCouple, isCorp])

  const photoShareUrl = `${window.location.origin}/invite/${effectiveSlug}/foto`

  /* ── Masa kartı SVG — qonaqların skan edəcəyi çap kartı ── */
  const downloadTableCard = useCallback(() => {
    const names = isCouple
      ? `${weddingData?.groomName || ''} & ${weddingData?.brideName || ''}`
      : weddingData?.brideName || weddingData?.eventName || 'Digitoy'
    const dateStr = weddingData?.date || ''
    const qrUrl = photoShareUrl

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FDFAF4"/><stop offset="100%" stop-color="#F2EAD6"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="transparent"/><stop offset="40%" stop-color="#C5A059"/><stop offset="60%" stop-color="#C5A059"/><stop offset="100%" stop-color="transparent"/></linearGradient>
  </defs>
  <rect width="420" height="420" fill="url(#bg)"/>
  <rect x="1" y="1" width="418" height="418" fill="none" stroke="rgba(197,160,89,0.4)" stroke-width="1"/>
  <rect x="12" y="12" width="396" height="396" fill="none" stroke="rgba(197,160,89,0.18)" stroke-width="0.5"/>
  <!-- Corner ornaments -->
  <path d="M22,22 L42,22 M22,22 L22,42" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <path d="M398,22 L378,22 M398,22 L398,42" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <path d="M22,398 L42,398 M22,398 L22,378" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <path d="M398,398 L378,398 M398,398 L398,378" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <!-- Title -->
  <text x="210" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(197,160,89,0.85)" letter-spacing="4">FOTO · PAYLAŞIM</text>
  <rect x="105" y="72" width="210" height="0.8" fill="url(#gold)"/>
  <!-- Names -->
  <text x="210" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-weight="300" fill="#1A1A1A">${names}</text>
  <text x="210" y="132" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(140,123,107,0.7)" letter-spacing="2">${dateStr}</text>
  <rect x="150" y="144" width="120" height="0.6" fill="url(#gold)"/>
  <!-- QR placeholder area -->
  <rect x="135" y="158" width="150" height="150" rx="4" fill="white" stroke="rgba(197,160,89,0.3)" stroke-width="1"/>
  <text x="210" y="244" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(140,123,107,0.5)">${qrUrl}</text>
  <!-- Footer label -->
  <rect x="105" y="320" width="210" height="0.6" fill="url(#gold)"/>
  <text x="210" y="342" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(140,123,107,0.65)" letter-spacing="3">TOY ŞƏKİLLƏRİNİZİ PAYLAŞIN</text>
  <text x="210" y="380" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="rgba(197,160,89,0.6)" letter-spacing="2">digitoy.az</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `masa-karti-${effectiveSlug || 'digitoy'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }, [weddingData, effectiveSlug, photoShareUrl, isCouple])

  return {
    pageSlug,
    effectiveSlug,
    photoShareUrl,
    downloadTableCard,
    demoPhotos: weddingData?.demoPhotos || [],
  }
}

export default useGallery
