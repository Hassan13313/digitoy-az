import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   SNOW GLOBE — lüks bayram gecələri seriyası (2026-11, foto redizayn)

   Qış nağılı — şüşə kürədə qar, kiçik ev və küknarlar; açılışda kürədə qar yağır, sonra kürə böyüyüb bütün ekrana açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/sg-*). Əvvəlki dizayn legacy/v2/snow-globe-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('snow-globe')
const ID = 'snow-globe'

const LINKS = { primary: ['ACCENT'], secondary: ['GREEN'], accent: ['GOLD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5200, overlay: { kind: 'globe', bg: '#1D3346', wood: '#6B4226' } }

export default function SnowGlobeTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.body },
    names: { font: f.heading, lh: 1.25, inlineSize: 'clamp(42px, 12vw, 58px)', seatSize: 32, signSize: 28 },
    ornament: '❄', countdown: 'bauble', seat: 'circle', program: 'card', detail: 'arch', gallery: 'circle', cardRadius: 18,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
