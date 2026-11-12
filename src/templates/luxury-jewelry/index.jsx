import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   LUXURY JEWELRY — lüks toy seriyası (2026-11, foto redizayn)

   Zərgər butiki gecə — zümrüd kəsimli brilyant üzük, platin, zümrüd məxmər; açılışda kamera üzükdən geri çəkilir, brilyant parlayır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/lj-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('luxury-jewelry')
const ID = 'luxury-jewelry'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* lj-1 fotosunda işıq nöqtələri (0..1) */
const RING = [0.49, 0.53]
const OPENING = { kind: 'zoom', ms: 5000, origin: RING, glow: { kind: 'bloom', pts: [RING], color: 'rgba(235,255,250,.9)', size: '60vw' } }

export default function LuxuryJewelryTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, italic: true, inlineSize: 'clamp(40px, 11.5vw, 54px)' },
    mono: true, subSlot: 'sub', ornament: '◇', countdown: 'facet', seat: 'circle', program: 'card', detail: 'inset', gallery: 'rect', headWeight: 400,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
