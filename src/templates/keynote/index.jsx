import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   KEYNOTE — lüks korporativ seriyası (2026-11, foto redizayn)

   Konfrans və təqdimat səhnəsi — mavi LED ekran, işıq şüaları; açılışda ekran CRT kimi yanır, nazik işıq xətti açılır və səhnə görünür.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/kn-*). Əvvəlki dizayn legacy/v2/keynote-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('keynote')
const ID = 'keynote'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACC2'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4400, overlay: { kind: 'crt', bg: '#060A14', dot: '#3D7BFF' } }

export default function KeynoteTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, lh: 1.02, track: '-.01em', inlineSize: 'clamp(32px, 9vw, 44px)', inlineMax: 11 },
    heroAlign: 'left', ornament: null, countdown: 'timer', seat: 'ticket', program: 'list', detail: 'inset', gallery: 'rect', headWeight: 600, numWeight: 600, cardRadius: 12, btnRadius: 10,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
