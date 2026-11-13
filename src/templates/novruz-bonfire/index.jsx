import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   NOVRUZ TONQALI — lüks bayram gecələri seriyası (2026-11, foto redizayn)

   Novruz axşamı — həyətdə tonqal, ulduzlu səma, qığılcımlar; açılışda qaranlıqda közlər qızarır, alov qalxır və qığılcımlar uçur.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/nb-*). Əvvəlki dizayn legacy/v2/novruz-bonfire-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('novruz-bonfire')
const ID = 'novruz-bonfire'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'fire', night: '#120A07', ember: '#C2410C', flame: '#F59E0B' } }

export default function NovruzBonfireTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, lh: 1.04, inlineSize: 'clamp(34px, 9.6vw, 46px)', inlineMax: 12 },
    ornament: '✺', countdown: 'ember', seat: 'circle', program: 'list', detail: 'full', gallery: 'arch', headWeight: 600, cardRadius: 4,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
