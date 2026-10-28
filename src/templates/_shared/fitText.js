import { useLayoutEffect } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   UZUN MÜŞTƏRİ MƏTNİNİ ÇƏRÇİVƏYƏ SIĞDIR (2026-10-28)

   Adlar, tədbir adı, masa adı müştərinin yazdığı sərbəst mətndir. Dizayn
   iri şriftlə qurulub (44–72px) və «Məhəmmədhüseyn» kimi uzun TƏK SÖZ
   sətirdə bölünmür — 360px telefonda ekrandan çıxırdı. CSS-də «mətni
   konteynerə sığdır» yoxdur, ona görə ölçürük:
     • şablon elementi `data-fit` ilə işarələyir (yalnız adlar/başlıqlar);
     • render-dən, şriftlər yükləndikdən və ekran dəyişəndən sonra mətnin
       həqiqi sətir eni ölçülür; sığmırsa şrift tam sığacaq qədər kiçilir
       (`--fit-px`), sığırsa dizayn ölçüsü olduğu kimi qalır.
   ⚠ React stilinə toxunulmur: ölçü ayrıca atribut + CSS dəyişəni ilə verilir,
   ona görə React yenidən render edəndə dizayn ölçüsü pozulmur.
   ⚠ `data-fit` olmayan elementlərə (köhnə versiya şablonları daxil) təsir yoxdur.
   ───────────────────────────────────────────────────────────────────────── */

const STYLE_ID = 'digitoy-fit-style'
const MIN_PX = 12

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = '[data-fit-on]{font-size:var(--fit-px)!important}'
  document.head.appendChild(s)
}

function contentWidth(el) {
  const cs = getComputedStyle(el)
  return el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0)
}

/** Mətnin ən geniş SƏTRİ (px). Hər mətn düyününün parçaları sətirlərə görə
    qruplaşdırılır: «Ad», «&», «Ad» ayrı düyünlərdir, amma eyni sətirdədir.
    Yalnız mətnin özü ölçülür — blok elementlərin boş sahəsi sayılmır.
    (Ortalanmış flex elementində daşma iki tərəfə gedir, `scrollWidth` yarısını görür.) */
function textWidth(el) {
  const lines = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let node
  while ((node = walker.nextNode())) {
    if (!node.textContent.trim()) continue
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (rect.width < 1) continue
      const mid = (rect.top + rect.bottom) / 2
      const line = lines.find((l) => mid > l.top && mid < l.bottom)
      if (line) { line.left = Math.min(line.left, rect.left); line.right = Math.max(line.right, rect.right) }
      else lines.push({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right })
    }
  }
  let w = 0
  for (const l of lines) w = Math.max(w, l.right - l.left)
  return Math.max(w, el.scrollWidth > el.clientWidth ? el.scrollWidth : 0)
}

export function fitElement(el) {
  if (!el.isConnected) return
  el.removeAttribute('data-fit-on')
  let avail = contentWidth(el)
  const parent = el.parentElement
  if (parent) {
    const pw = contentWidth(parent)
    if (pw > 0) avail = avail > 0 ? Math.min(avail, pw) : pw
  }
  avail = Math.min(avail, document.documentElement.clientWidth - 24)
  if (!(avail > 0)) return
  const need = textWidth(el)
  if (need <= avail + 1) return
  const px = parseFloat(getComputedStyle(el).fontSize) || 16
  const next = Math.max(MIN_PX, Math.floor(((px * avail) / need) * 0.97 * 10) / 10)
  el.style.setProperty('--fit-px', `${next}px`)
  el.setAttribute('data-fit-on', '')
}

/** Səhifədəki bütün `[data-fit]` elementlərini izlə və sığdır (TemplateRenderer bir dəfə çağırır) */
export function useAutoFit() {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return undefined
    ensureStyle()
    let raf = 0
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => document.querySelectorAll('[data-fit]').forEach(fitElement))
    }
    const touchesFit = (m) => {
      const t = m.target.nodeType === 1 ? m.target : m.target.parentElement
      if (t && t.closest && t.closest('[data-fit]')) return true
      for (const n of m.addedNodes || []) {
        if (n.nodeType === 1 && (n.matches?.('[data-fit]') || n.querySelector?.('[data-fit]'))) return true
      }
      return false
    }
    const mo = new MutationObserver((list) => { if (list.some(touchesFit)) run() })
    mo.observe(document.body, { childList: true, subtree: true, characterData: true })
    window.addEventListener('resize', run)
    const fonts = document.fonts
    fonts?.ready?.then(run)
    fonts?.addEventListener?.('loadingdone', run)
    run()
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('resize', run)
      fonts?.removeEventListener?.('loadingdone', run)
    }
  }, [])
}
