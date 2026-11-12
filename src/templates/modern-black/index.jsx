import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN BLACK — lüks toy seriyası (2026-11, foto redizayn)

   Qara minimalizm — qara beton, tək işıq şüası, qara kallalar; açılışda kadr qaranlıqdan işıqlanır, işıq şüası yanır. Toy və ad günündə işlənir, fotolarda insan yoxdur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/mb-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('modern-black')
const ID = 'modern-black'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* mb-1 fotosunda işıq nöqtələri (0..1) */
const SPOT = [0.5, 0.56]
const OPENING = { kind: 'bright', ms: 4600, glow: { kind: 'bloom', pts: [SPOT], color: 'rgba(255,255,255,.5)', size: '80vw' } }

export default function ModernBlackTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, weight: 500, upper: true, track: '-.01em', lh: 1.0, inlineSize: 'clamp(30px, 8.8vw, 42px)', inlineMax: 11, seatSize: 22, signSize: 16 },
    heroAlign: 'left', ornament: null, countdown: 'stack', seat: 'card', program: 'list', detail: 'full', gallery: 'rect', btnRadius: 0, onAccent: '#000000', headUpper: true, headWeight: 500, numWeight: 300, galleryKind: 'night',
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
