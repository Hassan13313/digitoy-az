import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   XONÇA — lüks xına seriyası (2026-11, foto redizayn)

   Şamlı mis xonça — şirniyyat, xına və qırmızı lentlər; açılışda kadr qaranlıqdan işıqlanır, xonçanın şamları bir-bir alışır, qığılcımlar qalxır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/xn-*). Əvvəlki dizayn legacy/v2/xonca-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('xonca')
const ID = 'xonca'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* xn-1 fotosunda nöqtələr (0..1) */
const FLAMES = [[0.366, 0.254], [0.315, 0.32], [0.89, 0.28], [0.815, 0.38], [0.953, 0.395], [0.323, 0.784]]
const OPENING = { kind: 'bright', ms: 4800, glow: { kind: 'bloom', pts: FLAMES, color: 'rgba(255,214,140,.85)', size: '46vw' }, overlay: { kind: 'embers', from: '62%' } }

export default function XoncaTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, weight: 500, italic: true, inlineSize: 'clamp(40px, 11.5vw, 54px)' },
    ornament: '✺', countdown: 'candle', seat: 'card', program: 'card', detail: 'inset', gallery: 'rect', cardRadius: 4,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
