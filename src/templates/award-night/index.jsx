import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   AWARD NIGHT — lüks korporativ seriyası (2026-11, foto redizayn)

   Mükafatlandırma gecəsi — qızılı kubok, qırmızı pərdə, projektor; açılışda qaranlıqda projektor dairəsi səhnəni gəzir və böyüyüb hər şeyi işıqlandırır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/an-*). Əvvəlki dizayn legacy/v2/award-night-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('award-night')
const ID = 'award-night'

const LINKS = { primary: ['ACCENT'], secondary: ['RIB'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'spot', dark: '#12030A' } }

export default function AwardNightTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 500, upper: true, track: '.06em', lh: 1.08, inlineSize: 'clamp(30px, 8.6vw, 40px)', inlineMax: 12 },
    ornament: '✦', countdown: 'medal', seat: 'circle', program: 'card', detail: 'arch', gallery: 'arch', headUpper: true, headWeight: 500, cardRadius: 2,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
