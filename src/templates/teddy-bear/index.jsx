import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   TEDDY BEAR — lüks baby shower seriyası (2026-11, foto redizayn)

   Yumşaq plüş ayıcıq — toxunma yorğan, bayraqcıqlar, isti uşaq otağı; açılışda toxunma yorğan aşağı sürüşür, ürəkciklər uçur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/tb-*). Əvvəlki dizayn legacy/v2/teddy-bear-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('teddy-bear')
const ID = 'teddy-bear'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['SKY'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'blanket', wool: '#EADCC8', wool2: '#DCC8AE', trim: '#BFD9EA', heart: '#E7A6AB' } }

export default function TeddyBearTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 700, lh: 1.1, inlineSize: 'clamp(36px, 10vw, 48px)' },
    ornament: '♥', countdown: 'patch', seat: 'card', program: 'card', detail: 'inset', gallery: 'rect', headWeight: 700, numWeight: 700, cardRadius: 16, btnRadius: 999,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
