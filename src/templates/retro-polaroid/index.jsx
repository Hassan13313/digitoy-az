import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   RETRO POLAROID — lüks ildönümü seriyası (2026-11, foto redizayn)

   Retro ildönümü — 70-ci illər, ani foto, gün batımı; açılışda flaş çaxır, şəkil polaroid çərçivəsində aşkarlanır və çərçivə böyüyür.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/rt-*). Əvvəlki dizayn legacy/v2/retro-polaroid-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('retro-polaroid')
const ID = 'retro-polaroid'

const LINKS = { primary: ['ACCENT'], secondary: ['TEAL'], accent: ['MUSTARD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'flash', frame: '#FFFDF7', bg: '#F4EAD5' } }

export default function RetroPolaroidTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 400, lh: 1.05, inlineSize: 'clamp(36px, 10vw, 48px)' },
    ornament: '✺', countdown: 'polaroid', seat: 'card', program: 'card', detail: 'inset', gallery: 'rect', cardRadius: 6,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
