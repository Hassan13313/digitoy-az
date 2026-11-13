import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   MIDNIGHT CLOCK — lüks bayram gecələri seriyası (2026-11, foto redizayn)

   Yeni il gecəsi — zər saat, gecəyarısı, Bakı üzərində atəşfəşanlıq; açılışda əqrəb XII-yə çatır, işıq çaxır və saat böyüyüb əriyir.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/mk-*). Əvvəlki dizayn legacy/v2/midnight-clock-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('midnight-clock')
const ID = 'midnight-clock'

const LINKS = { primary: ['BG2'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5200, overlay: { kind: 'clock', night: '#0B1024', gold: '#D9B25F' } }

export default function MidnightClockTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 500, italic: true, lh: 1.06, inlineSize: 'clamp(38px, 11vw, 52px)' },
    ornament: '✧', countdown: 'dial', seat: 'card', program: 'list', detail: 'full', gallery: 'circle', headItalic: true, cardRadius: 0,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
