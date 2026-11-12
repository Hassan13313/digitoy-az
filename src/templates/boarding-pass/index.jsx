import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   BOARDING PASS — lüks toy seriyası (2026-11, foto redizayn)

   Şəxsi təyyarə — mavi saatda uçuş zolağı, qırmızı xalçalı pilləkən, birinci sinif salon; açılışda kamera təyyarədən geri çəkilir. Toy və ad günündə işlənir, fotolarda insan yoxdur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/bp-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('boarding-pass')
const ID = 'boarding-pass'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* bp-1 fotosunda işıq nöqtələri (0..1) */
const JET = [0.5, 0.53]
const CABIN = [0.62, 0.5]
const OPENING = { kind: 'zoom', ms: 5000, origin: JET, glow: { kind: 'bloom', pts: [CABIN], color: 'rgba(255,214,150,.6)', size: '70vw' } }

export default function BoardingPassTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.mono || f.body, num: f.heading },
    names: { font: f.heading, weight: 500, upper: true, track: '.03em', lh: 1.02, inlineSize: 'clamp(36px, 10.4vw, 50px)', inlineMax: 12, seatSize: 24, signSize: 18 },
    heroAlign: 'left', ornament: '✈', countdown: 'flap', seat: 'ticket', program: 'list', detail: 'inset', gallery: 'rect', btnRadius: 2, headUpper: true, headWeight: 500, numWeight: 500, galleryKind: 'night',
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
