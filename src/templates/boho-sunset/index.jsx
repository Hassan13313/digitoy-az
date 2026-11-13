import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   BOHO SUNSET — lüks qız gecəsi seriyası (2026-11, foto redizayn)

   Boho gün batımı — makrame, pampas otu, terrakota və qum; açılışda tağ zolaqları arxasında günəş batır və zolaqlar böyüyüb açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/bh-*). Əvvəlki dizayn legacy/v2/boho-sunset-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('boho-sunset')
const ID = 'boho-sunset'

const LINKS = { primary: ['ACCENT'], secondary: ['SAGE'], accent: ['SAND'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'sunset', sand: '#FBF3EA', sun: '#E8925A', bands: ['#C2643D', '#E0A17A', '#8D9A78', '#E9CDB0'] } }

export default function BohoSunsetTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 500, italic: true, lh: 1.06, inlineSize: 'clamp(38px, 11vw, 52px)' },
    ornament: '☼', countdown: 'arch', seat: 'card', program: 'card', detail: 'arch', gallery: 'arch', headItalic: true, cardRadius: 14,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
