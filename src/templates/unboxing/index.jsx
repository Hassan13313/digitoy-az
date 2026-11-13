import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   UNBOXING — lüks açılış və təqdimat seriyası (2026-11, foto redizayn)

   Məhsul və brend təqdimatı — premium bənövşəyi qutu, işıq şüaları; açılışda qutunun qapağı uçur və içəridən işıq şüaları yayılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/ub-*). Əvvəlki dizayn legacy/v2/unboxing-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('unboxing')
const ID = 'unboxing'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'box', bg: '#F4F3FA', box: '#6E50F0', ribbon: '#C9BDFF', glow: '#B9A8FF' } }

export default function UnboxingTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, lh: 1.02, track: '-.02em', inlineSize: 'clamp(34px, 9.6vw, 46px)', inlineMax: 11 },
    ornament: '✦', countdown: 'beam', seat: 'card', program: 'card', detail: 'full', gallery: 'rect', headWeight: 600, numWeight: 600, cardRadius: 18, btnRadius: 999,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
