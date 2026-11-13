import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   MAŞALLAH — lüks sünnət seriyası (2026-11, foto redizayn)

   Sünnət toyunun ənənəvi rəmzləri — göz muncuğu, kobalt atlas lent, zər; açılışda foto göz muncuğunun bəbəyindən görünür, muncuq böyüyüb əriyir.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/ms-*). Əvvəlki dizayn legacy/v2/mashallah-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('mashallah')
const ID = 'mashallah'

const LINKS = { primary: ['COB'], secondary: ['MUTE'], accent: ['TURQ'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'nazar', cobalt: '#0D3B8E', turq: '#27B0C8', white: '#F7FBFF', pupil: '#0A1A33', bg: '#F6F2E8' } }

export default function MashallahTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, weight: 500, italic: true, inlineSize: 'clamp(40px, 11.5vw, 54px)' },
    ornament: '◉', countdown: 'nazar', seat: 'circle', program: 'list', detail: 'full', gallery: 'circle', headItalic: true,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
