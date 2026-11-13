import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   YEARBOOK — lüks məzuniyyət seriyası (2026-11, foto redizayn)

   Məzun albomu — varsity gödəkcəsi, şkaflı dəhliz, mavi və sarı; açılışda xətli vərəqə varsity yamağı möhür kimi vurulur və vərəq yana sürüşür.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/yb-*). Əvvəlki dizayn legacy/v2/yearbook-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('yearbook')
const ID = 'yearbook'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['YEL'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4600, overlay: { kind: 'varsity', blue: '#1F4FD1', gold: '#FFC629', red: '#E5484D', font: "'Fira Sans Extra Condensed', sans-serif" } }

export default function YearbookTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 800, upper: true, lh: .98, inlineSize: 'clamp(36px, 10vw, 48px)', inlineMax: 11 },
    heroAlign: 'left', ornament: '★', countdown: 'jersey', seat: 'ticket', program: 'card', detail: 'inset', gallery: 'rect', headUpper: true, headWeight: 800, numWeight: 800, cardRadius: 10,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
