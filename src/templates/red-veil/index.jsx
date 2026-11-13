import { getTemplateTheme, FONT_STACKS } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   RED VEIL — lüks xına seriyası (2026-11, foto redizayn)

   Xına gecəsinin qırmızı örpəyi — şam işığında örpəkli gəlin, qızılı tikmə; açılışda şəffaf qırmızı örpək (buta tikməli, saçaqlı) yuxarı qalxır və kadr açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/rv-*). Əvvəlki dizayn legacy/v2/red-veil-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('red-veil')
const ID = 'red-veil'

const LINKS = { primary: ['VEL'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'zoom', ms: 5000, overlay: { kind: 'veil', color: '#8E1B2B', gold: '#E2B85C' } }

export default function RedVeilTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: FONT_STACKS.greatVibes, lh: 1.2, inlineSize: 'clamp(44px, 12.5vw, 60px)', seatSize: 34, signSize: 30 },
    ornament: '❦', countdown: 'velvet', seat: 'circle', program: 'list', detail: 'full', gallery: 'arch', headItalic: true,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
