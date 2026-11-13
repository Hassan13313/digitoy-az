import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   CIRCUS SHOW — lüks uşaq ad günü seriyası (2026-11, foto redizayn)

   Köhnə sirk afişasının dili — zolaqlı çadır, lampalar, nağara; açılışda çadırın iki pərdəsi yana açılır, lampalar yanıb-sönür.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/cs-*). Əvvəlki dizayn legacy/v2/circus-show-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('circus-show')
const ID = 'circus-show'

const LINKS = { primary: ['ACCENT', 'RED'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'tent', red: '#C62537', cream: '#F7ECD6', gold: '#F2B23A' } }

export default function CircusShowTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, weight: 400, upper: true, lh: 1.02, inlineSize: 'clamp(34px, 9.4vw, 46px)', inlineMax: 11 },
    ornament: '★', countdown: 'pennant', seat: 'ticket', program: 'card', detail: 'inset', gallery: 'rect', headUpper: true, cardRadius: 6,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
