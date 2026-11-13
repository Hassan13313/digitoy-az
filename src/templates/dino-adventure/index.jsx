import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   DINO ADVENTURE — lüks uşaq ad günü seriyası (2026-11, foto redizayn)

   Dinozavr ekspedisiyası — cəngəllik, vulkan, nəhəng yumurta; açılışda xallı yumurta yellənir, çatlayır və iki yarısı yana düşür.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/da-*). Əvvəlki dizayn legacy/v2/dino-adventure-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('dino-adventure')
const ID = 'dino-adventure'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'egg', shell: '#EFE3C2', spot: '#3E7A3A', jungle: '#23402A' } }

export default function DinoAdventureTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 800, lh: 1.02, inlineSize: 'clamp(34px, 9.6vw, 46px)', inlineMax: 11 },
    heroAlign: 'left', ornament: '◆', countdown: 'footprint', seat: 'card', program: 'list', detail: 'full', gallery: 'rect', headWeight: 800, numWeight: 700, cardRadius: 12,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
