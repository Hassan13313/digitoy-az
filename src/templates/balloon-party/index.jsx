import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   BALLOON PARTY — lüks uşaq ad günü seriyası (2026-11, foto redizayn)

   Şirin bayram — pastel və folqa şarlar, qatlı tort; açılışda ekranı örtən şarlar yuxarı uçub gedir.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/bl-*). Əvvəlki dizayn legacy/v2/balloon-party-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('balloon-party')
const ID = 'balloon-party'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['GOLD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'balloons', bg: '#FFF8F3', colors: ['#E58FB0', '#F2A98A', '#D8A64A', '#C9577C'] } }

export default function BalloonPartyTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 800, lh: 1.05, inlineSize: 'clamp(38px, 10.5vw, 50px)' },
    ornament: '❤', countdown: 'balloon', seat: 'circle', program: 'card', detail: 'arch', gallery: 'circle', headWeight: 800, numWeight: 800, cardRadius: 18, btnRadius: 999,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
