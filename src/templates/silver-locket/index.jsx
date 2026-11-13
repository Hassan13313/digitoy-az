import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   SILVER LOCKET — lüks ildönümü seriyası (2026-11, foto redizayn)

   Gümüş toy və ildönümü — gümüş ürək medalyon, qızılgül bağı; açılışda zəncirdən asılan medalyonun iki qapağı açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/sv-*). Əvvəlki dizayn legacy/v2/silver-locket-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('silver-locket')
const ID = 'silver-locket'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['SILVER'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'locket', silver: '#B9C0CA', bg: '#F4F1EC' } }

export default function SilverLocketTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 400, italic: true, inlineSize: 'clamp(40px, 11.5vw, 54px)' },
    ornament: '♥', countdown: 'heart', seat: 'circle', program: 'list', detail: 'arch', gallery: 'circle', headItalic: true,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
