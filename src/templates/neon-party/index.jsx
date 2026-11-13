import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   NEON PARTY — lüks korporativ seriyası (2026-11, foto redizayn)

   Korporativ əyləncə gecəsi — kərpic divar, çəhrayı və mavi neon; açılışda divardakı neon çərçivə titrəyərək yanır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/np-*). Əvvəlki dizayn legacy/v2/neon-party-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('neon-party')
const ID = 'neon-party'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['CYAN'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4600, overlay: { kind: 'neon', brick: '#2A1A24', pink: '#FF4FD8', cyan: '#3CF2FF' } }

export default function NeonPartyTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 700, upper: true, lh: 1.02, inlineSize: 'clamp(32px, 9vw, 44px)', inlineMax: 11 },
    ornament: '✦', countdown: 'tube', seat: 'ticket', program: 'list', detail: 'full', gallery: 'circle', headUpper: true, headWeight: 700, numWeight: 600, cardRadius: 14, btnRadius: 999,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
