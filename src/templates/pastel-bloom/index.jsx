import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   PASTEL BLOOM — lüks baby shower seriyası (2026-11, foto redizayn)

   Akvarel kağızına çəkilmiş pastel çiçəklər — pion, ranunkulus, adaçayı; açılışda boyaq ləkələri kağıza yayılır, sonra kağız əriyib fotonu açır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/pb-*). Əvvəlki dizayn legacy/v2/pastel-bloom-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('pastel-bloom')
const ID = 'pastel-bloom'

const LINKS = { primary: ['ACCENT'], secondary: ['SAGE'], accent: ['SAGE'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5200, overlay: { kind: 'watercolor', paper: '#FCF8F2', colors: ['#E7A6AB', '#A9C2A2', '#F2C9A8'] } }

export default function PastelBloomTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 500, italic: true, inlineSize: 'clamp(40px, 11.5vw, 54px)' },
    ornament: '❀', countdown: 'blot', seat: 'circle', program: 'list', detail: 'arch', gallery: 'arch', headItalic: true,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
