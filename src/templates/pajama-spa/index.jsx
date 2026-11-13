import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   PAJAMA SPA — lüks qız gecəsi seriyası (2026-11, foto redizayn)

   Pijama və spa gecəsi — yumşaq xalatlar, üz maskaları, şam və çay; açılışda yastıq yellənir, partlayır və lələklər uçuşur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/ps-*). Əvvəlki dizayn legacy/v2/pajama-spa-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('pajama-spa')
const ID = 'pajama-spa'

const LINKS = { primary: ['ACCENT'], secondary: ['MINT'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'pillow', bg: '#FFF8F3', pillow: '#F7D3DC', deep: '#D97A93' } }

export default function PajamaSpaTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.body },
    names: { font: f.heading, lh: 1.15, inlineSize: 'clamp(40px, 11.6vw, 56px)', seatSize: 30, signSize: 26 },
    ornament: '♡', countdown: 'pillowc', seat: 'circle', program: 'card', detail: 'arch', gallery: 'circle', cardRadius: 24, btnRadius: 999,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
