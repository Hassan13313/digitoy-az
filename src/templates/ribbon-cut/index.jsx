import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   RIBBON CUT — lüks açılış və təqdimat seriyası (2026-11, foto redizayn)

   Təntənəli açılış — zümrüd qapılar, qırmızı lent, qızılı qayçı; açılışda lent kəsilir, yarıları düşür və qapılar içəri açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/rc-*). Əvvəlki dizayn legacy/v2/ribbon-cut-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('ribbon-cut')
const ID = 'ribbon-cut'

const LINKS = { primary: ['EMERALD'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5200, overlay: { kind: 'ribbon', lintel: '#F7F1E3', emerald: '#145A45', deep: '#0B2E24', gold: '#D8B25A', red: '#C0172E' } }

export default function RibbonCutTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 500, lh: 1.06, inlineSize: 'clamp(32px, 9vw, 44px)', inlineMax: 12 },
    ornament: '◆', countdown: 'plaque', seat: 'card', program: 'card', detail: 'arch', gallery: 'arch', headWeight: 500, cardRadius: 2,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
