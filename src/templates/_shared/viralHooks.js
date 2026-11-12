import { useEffect, useRef, useState } from 'react'

/* VIRAL — «viral video» toy şablonlarının komponent olmayan köməkçiləri
   (fast refresh qaydası: komponentlər _shared/viral.jsx-dədir). */

export const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const VIRAL_CSS = `
@keyframes vr-kb { from { scale: 1.02 } to { scale: 1.14 } }
@keyframes vr-reel { to { translate: -50% 0 } }
@keyframes vr-bob { 0%,100% { translate: 0 0 } 50% { translate: 0 -6px } }
@keyframes vr-drop { 0% { scale: 1 0; opacity: 1 } 50% { scale: 1 1 } 100% { scale: 1 1; opacity: 0 } }
@keyframes vr-up { from { opacity: 0; translate: 0 14px } to { opacity: 1; translate: 0 0 } }
@keyframes vr-halo { 0%,100% { box-shadow: 0 0 0 0 var(--vr-halo, rgba(255,255,255,.4)) } 60% { box-shadow: 0 0 0 16px rgba(255,255,255,0) } }
@keyframes vr-breath { 0%,100% { scale: 1 } 50% { scale: 1.04 } }
@keyframes vr-glint { 0% { background-position: 120% 0 } 60%,100% { background-position: -60% 0 } }
@keyframes vr-flash { 0% { opacity: 0 } 40% { opacity: .9 } 100% { opacity: 0 } }
[data-vr] .vr-w { display: inline-block; opacity: 0; translate: 0 .45em; filter: blur(6px); transition: opacity .9s ease, translate 1s cubic-bezier(.2,.7,.2,1), filter .9s ease; }
[data-vr] .vr-in .vr-w { opacity: 1; translate: 0 0; filter: none; }
[data-vr] .vr-l { display: inline-block; opacity: 0; translate: 0 16px; filter: blur(8px); transition: opacity 1s ease, translate 1.2s cubic-bezier(.2,.8,.2,1), filter 1s ease; }
[data-vr] .vr-on .vr-l { opacity: 1; translate: 0 0; filter: none; }
[data-vr] .vr-rise { opacity: 0; translate: 0 22px; transition: opacity 1.1s ease, translate 1.2s cubic-bezier(.2,.7,.2,1); }
[data-vr] .vr-rise.vr-in { opacity: 1; translate: 0 0; }
[data-vr] .vr-wipe { clip-path: inset(18% 0 18% 0); transition: clip-path 1.6s cubic-bezier(.6,0,.2,1); }
[data-vr] .vr-wipe.vr-in { clip-path: inset(0 0 0 0); }
[data-vr] .vr-kb { animation: vr-kb 18s ease-in-out infinite alternate; }
[data-vr] .vr-rc { display: inline-block; height: 1em; overflow: hidden; vertical-align: top; }
[data-vr] .vr-rs { display: block; line-height: 1; transition: transform .9s cubic-bezier(.5,1.6,.4,1); }
@media (prefers-reduced-motion: reduce) {
  [data-vr] .vr-w, [data-vr] .vr-l, [data-vr] .vr-rise { opacity: 1 !important; translate: none !important; filter: none !important; transition: none !important; }
  [data-vr] .vr-wipe { clip-path: none !important; }
  [data-vr] .vr-kb { animation: none !important; }
}
`

/** Element bir dəfə görünəndə true olur */
export function useInView(threshold = 0.18) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return undefined
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect() }
    }, { threshold, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen]
}

/**
 * Şəkil `object-fit: cover` ilə kəsiləndə fotodakı (fx, fy) nöqtəsi
 * kadrın harasına düşür (0..1). Fişəng qığılcımını fotodakı fişəngə bağlayır.
 */
export function coverSpot(img, fx, fy) {
  if (!img) return [fx, fy]
  const W = img.clientWidth, H = img.clientHeight
  const r = (img.naturalWidth / img.naturalHeight) || (W / H) || 1
  let w = W, h = W / r
  if (h < H) { h = H; w = H * r }
  return [((W - w) / 2 + fx * w) / W, ((H - h) / 2 + fy * h) / H]
}

/** Foto yolu */
export const vimg = (name) => `/img/wedding/viral/${name}.webp`
