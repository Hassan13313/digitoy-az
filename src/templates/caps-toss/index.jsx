import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   CAPS TOSS — lüks məzuniyyət seriyası (2026-11, foto redizayn)

   Məzuniyyət gecəsi — gecə mavisi, qızılı, havaya atılan papaqlar; açılışda üç məzun papağı fırlanaraq havaya uçur, qızılı konfetti yağır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/ct-*). Əvvəlki dizayn legacy/v2/caps-toss-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('caps-toss')
const ID = 'caps-toss'

const LINKS = { primary: ['BG2'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'caps', navy: '#0F1A33', cap: '#121A2C', gold: '#E5B94E' } }

export default function CapsTossTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 500, lh: 1.06, inlineSize: 'clamp(34px, 9.4vw, 46px)', inlineMax: 12 },
    ornament: '✦', countdown: 'tassel', seat: 'card', program: 'list', detail: 'full', gallery: 'arch', headWeight: 500, cardRadius: 0,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
