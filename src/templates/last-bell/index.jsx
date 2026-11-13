import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   LAST BELL — lüks məzuniyyət seriyası (2026-11, foto redizayn)

   Son zəng — mis məktəb zəngi, ağ bant, qırmızı lent; açılışda zəng yellənir, səs dalğaları yayılır və qırmızı lent ekranı kəsib keçir.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/lb-*). Əvvəlki dizayn legacy/v2/last-bell-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('last-bell')
const ID = 'last-bell'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['GOLD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'bell', paper: '#FFFFFF', brass: '#D8A24A', red: '#C8102E', gold: '#E2BD6A' } }

export default function LastBellTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, lh: 1.06, inlineSize: 'clamp(36px, 10vw, 48px)' },
    ornament: '♪', countdown: 'calendar', seat: 'circle', program: 'card', detail: 'arch', gallery: 'circle', headWeight: 600, cardRadius: 8,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
