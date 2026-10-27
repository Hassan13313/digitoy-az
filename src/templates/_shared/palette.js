import { createContext, useContext } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   PALİTRA — premium şablonlarda admin RƏNG override-ları (Phase 42 · PART 4)

   NƏ ÜÇÜN: köhnə `TemplateShell` bütün rəngləri `theme` token-lərindən
   oxuyurdu, ona görə admin «Rəng» tabında `primary/secondary/accent/
   background/text` dəyişəndə dəvətnamə dərhal yeni rəngi alırdı. Premium
   redizaynda hər şablonun öz zəngin palitrası var (mis, fil sümüyü, gecə
   göyü…) və rənglər modul səviyyəsində sabitlər idi — admin override-ı
   heç yerə çatmırdı.

   İndi şablon palitrasını bir obyektdə saxlayır və hansı admin token-inin
   hansı palitra açarlarını idarə etdiyini `links`-də yazır. Render anında
   `resolvePalette` override-ı tətbiq edir, alt komponentlər palitranı
   `usePalette()` ilə kontekstdən oxuyur.

   ⚠ Override YOXDURSA eyni `base` obyekti qayıdır — dəvətnamənin görünüşü
   zərrə qədər dəyişmir (render HTML-i eynidir).
   ───────────────────────────────────────────────────────────────────────── */

/**
 * @param {Record<string,string>} base       şablonun öz rəngləri
 * @param {Record<string,string[]>} links    admin token-i → palitra açarları
 * @param {object} theme                     applyThemeOverrides() nəticəsi
 * @param {object} baseTheme                 şablonun templateConfig theme-i
 * @returns {Record<string,string>}
 */
export function resolvePalette(base, links, theme, baseTheme) {
  if (!theme || theme === baseTheme) return base
  let out = base
  for (const [token, keys] of Object.entries(links)) {
    const v = theme[token]
    if (!v || v === baseTheme?.[token]) continue
    if (out === base) out = { ...base }
    for (const k of keys) out[k] = v
  }
  /* Admin «Başlıq ölçüsü» əmsalı da kontekstlə gedir — bölmə başlıqları
     `scaleFont(size, C.hs)` ilə oxuyur */
  if (theme.headingScale) out = { ...out, hs: theme.headingScale }
  return out
}

/* Başlıq ölçüsünü admin əmsalına vurur (TemplateShell ilə eyni qayda).
   `clamp()` bütöv bir ədəd kimi vurulur — mobil/desktop uyğunlaşması qalır.
   Əmsal yoxdursa ORİJİNAL sətir qayıdır. */
export function scaleFont(size, scale) {
  if (!scale || scale === 1 || typeof size !== 'string') return size
  return `calc(${size} * ${scale})`
}

export const PaletteContext = createContext(null)

/** Şablonun cari (override tətbiq olunmuş) palitrası */
export function usePalette() {
  return useContext(PaletteContext)
}
