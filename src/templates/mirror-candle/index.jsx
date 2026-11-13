import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   MIRROR & CANDLE — lüks xına seriyası (2026-11, foto redizayn)

   Gəlinin güzgüsü və iki şam — gecə, antik zər; açılışda kadr oval güzgüdən görünür, şamlar alışır və güzgü bütün ekrana açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/mc-*). Əvvəlki dizayn legacy/v2/mirror-candle-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('mirror-candle')
const ID = 'mirror-candle'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* mc-1 fotosunda nöqtələr (0..1) */
const MIRROR = [0.494, 0.604]
const FLAMES = [[0.121, 0.508], [0.868, 0.5]]
const OPENING = { kind: 'oval', ms: 5000, origin: MIRROR, glow: { kind: 'bloom', pts: FLAMES, color: 'rgba(255,220,150,.85)', size: '52vw' } }

export default function MirrorCandleTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 400, inlineSize: 'clamp(38px, 11vw, 52px)' },
    ornament: '✧', countdown: 'mirror', seat: 'card', program: 'list', detail: 'full', gallery: 'circle', headWeight: 400, cardRadius: 0,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
