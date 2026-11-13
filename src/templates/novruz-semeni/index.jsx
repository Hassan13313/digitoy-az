import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   SƏMƏNI — lüks bayram gecələri seriyası (2026-11, foto redizayn)

   Novruz səhəri — qırmızı lentli səməni, boyalı yumurtalar, bahar çiçəkləri; açılışda aşağıdan səməni otları boy atır, qırmızı lent dolanır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/se-*). Əvvəlki dizayn legacy/v2/novruz-semeni-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('novruz-semeni')
const ID = 'novruz-semeni'

const LINKS = { primary: ['ACCENT'], secondary: ['GREEN'], accent: ['GOLD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'sprout', bg: '#FBF6EA', green: '#7DB547', dark: '#3E6B1D', red: '#C2272D' } }

export default function NovruzSemeniTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 700, lh: 1.06, inlineSize: 'clamp(36px, 10vw, 48px)' },
    ornament: '❀', countdown: 'egg', seat: 'card', program: 'card', detail: 'arch', gallery: 'circle', headWeight: 700, cardRadius: 16,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
