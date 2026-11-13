import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   LOVE LETTERS — lüks ildönümü seriyası (2026-11, foto redizayn)

   İllərin sevgi məktubları — iplə bağlanmış zərflər, quru qızılgül; açılışda zərflər yelpik kimi açılıb yuxarı dağılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/ll-*). Əvvəlki dizayn legacy/v2/love-letters-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('love-letters')
const ID = 'love-letters'

const LINKS = { primary: ['INK'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'letters', bg: '#EFE6D8', paper: '#F8F2E6', paper2: '#EFE3CF', twine: '#A07A55', wax: '#A9666A' } }

export default function LoveLettersTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.body },
    names: { font: f.heading, lh: 1.25, inlineSize: 'clamp(44px, 12.5vw, 60px)', seatSize: 34, signSize: 30 },
    ornament: '✉', countdown: 'sealed', seat: 'ticket', program: 'list', detail: 'arch', gallery: 'arch',
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
