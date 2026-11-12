import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   VINYL RECORD — lüks toy seriyası (2026-11, foto redizayn)

   Vinil gecəsi — köhnə patefon, kəhrəba işıq, caz salonu; açılışda val formasında dairəvi pəncərə bütün ekrana açılır, lampalar yanır. Toy və ad günündə işlənir, fotolarda insan yoxdur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/vr-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('vinyl-record')
const ID = 'vinyl-record'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* vr-1 fotosunda işıq nöqtələri (0..1) */
const RECORD = [0.64, 0.6]
const LAMPS = [[0.16, 0.36]]
const OPENING = { kind: 'iris', ms: 4600, origin: RECORD, glow: { kind: 'bloom', pts: LAMPS, color: 'rgba(255,200,120,.7)', size: '70vw' } }

export default function VinylRecordTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, inlineSize: 'clamp(38px, 11vw, 52px)' },
    heroAlign: 'left', mono: true, ornament: '♪', countdown: 'vinyl', seat: 'circle', program: 'list', detail: 'full', gallery: 'circle', galleryKind: 'night',
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
