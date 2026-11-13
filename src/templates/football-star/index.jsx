import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTBALL STAR — lüks sünnət seriyası (2026-11, foto redizayn)

   Kiçik bəy matçın ulduzudur — gecə stadionu, projektorlar, zər kubok; açılışda stadion projektorları bir-bir yanır və meydan işıqlanır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/fs-*). Əvvəlki dizayn legacy/v2/football-star-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('football-star')
const ID = 'football-star'

const LINKS = { primary: ['PITCH'], secondary: ['BG2'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'bright', ms: 5000, overlay: { kind: 'flood', glow: '#FFF6D0' } }

export default function FootballStarTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, upper: true, track: '.02em', lh: 1.0, inlineSize: 'clamp(36px, 10vw, 50px)', inlineMax: 11 },
    heroAlign: 'left', ornament: '⚽', countdown: 'led', seat: 'card', program: 'list', detail: 'full', gallery: 'rect', headUpper: true, headWeight: 600, numWeight: 600, btnRadius: 4, cardRadius: 4,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
