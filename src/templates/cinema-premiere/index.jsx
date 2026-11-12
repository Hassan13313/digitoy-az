import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   CINEMA PREMIERE — lüks toy seriyası (2026-11, foto redizayn)

   Kino premyerası — art-deko kinoteatr, lampalı marquee, qırmızı xalça; açılışda kino kimi üfüqi zolaqlar açılır, lampalar yanır. Toy və ad günündə işlənir, fotolarda insan yoxdur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/cp-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('cinema-premiere')
const ID = 'cinema-premiere'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* cp-1 fotosunda işıq nöqtələri (0..1) */
const MARQUEE = [[0.53, 0.46], [0.36, 0.47], [0.72, 0.45]]
const OPENING = { kind: 'letterbox', ms: 4600, glow: { kind: 'bloom', pts: MARQUEE, color: 'rgba(255,214,140,.75)', size: '80vw' } }

export default function CinemaPremiereTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, upper: true, track: '.04em', lh: 1.02, inlineSize: 'clamp(38px, 11vw, 52px)', inlineMax: 12, seatSize: 26, signSize: 20 },
    subSlot: 'sub', ornament: '★', countdown: 'marquee', seat: 'ticket', program: 'card', detail: 'full', gallery: 'rect', headUpper: true, headWeight: 600, numWeight: 600, galleryKind: 'night',
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
