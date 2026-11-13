import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   ROLLER SHUTTER — lüks açılış və təqdimat seriyası (2026-11, foto redizayn)

   Mağaza, studiya və showroom açılışı — beton fasad, metal jalüz, isti işıq; açılışda büzməli jalüz yuxarı qalxır və içəridən işıq düşür.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/rs-*). Əvvəlki dizayn legacy/v2/roller-shutter-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('roller-shutter')
const ID = 'roller-shutter'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4600, overlay: { kind: 'shutter', housing: '#1E2125', steel: '#9EA3A8', warm: '#FFB347' } }

export default function RollerShutterTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 700, upper: true, lh: .96, inlineSize: 'clamp(38px, 11vw, 52px)', inlineMax: 11 },
    heroAlign: 'left', ornament: null, countdown: 'steel', seat: 'ticket', program: 'list', detail: 'full', gallery: 'rect', headUpper: true, headWeight: 700, numWeight: 700, cardRadius: 4, btnRadius: 4, onAccent: '#15181B',
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
