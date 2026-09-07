/* Dil seçicisinin BÜTÜN şablon palitralarında WCAG AA (4.5) keçdiyini yoxlayır.
   LanguageSwitcher.jsx-dəki `pickReadable` məntiqinin eynisidir — palitra
   dəyişəndə bu test sınmalıdır. */
import { listTemplates } from '../src/templates/templateConfig.js'

const lum = (hex) => {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  const s = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2]
}
const contrast = (a, b) => {
  const l1 = lum(a), l2 = lum(b)
  if (l1 === null || l2 === null) return 0
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}
const pickReadable = (cands, bg) => {
  const list = [...cands.filter(Boolean), '#000000', '#FFFFFF']
  for (const c of list) if (contrast(c, bg) >= 4.5) return c
  return list.reduce((b, c) => (contrast(c, bg) > contrast(b, bg) ? c : b), list[0])
}

/* Sablonlarin `design.accentColor` ust-yazmalari (bax hemin index.jsx-ler).
   TemplateShell ACC = design.accentColor || theme.primary gonderir, ona gore
   HER İKİ hal yoxlanilir. */
const ACCENT_OVERRIDE = {
  'modern-black':   (th) => th.secondary,
  'night-sky':      (th) => th.accent,
  'oriental-luxe':  (th) => th.accent,
  'white-elegance': (th) => th.accent,
}

let fail = 0
for (const tpl of listTemplates()) {
  const th = tpl.theme
  if (!th) continue
  const track = th.surface || th.background
  const accents = [th.primary]
  const ov = ACCENT_OVERRIDE[tpl.id]
  if (ov) accents.push(ov(th))

  for (const ACC of accents) {
    const a = contrast(pickReadable([th.background, th.text], ACC), ACC)
    const i = contrast(pickReadable([th.muted, th.text], track), track)
    const ok = a >= 4.5 && i >= 4.5
    if (!ok) fail++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${tpl.id.padEnd(16)} acc=${ACC} active=${a.toFixed(2)}  inactive=${i.toFixed(2)}`)
  }
}
console.log(fail ? `\n${fail} şablon AA-dan keçmir` : '\nBütün şablonlar WCAG AA (4.5) keçir')
process.exit(fail ? 1 : 0)
