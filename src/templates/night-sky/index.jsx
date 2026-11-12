import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   NIGHT SKY — lüks toy seriyası (2026-11, foto redizayn)

   Gecə toyu, Qafqaz dağlarında Süd Yolu altında; açılışda kadr qaranlıqdan işıqlanır və ulduzlar sayrışır (fotodakı ulduzlara bağlıdır).
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/ns-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('night-sky')
const ID = 'night-sky'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* ns-1 fotosunda işıq nöqtələri (0..1) */
const STARS = [[0.761, 0.285], [0.122, 0.272], [0.79, 0.368], [0.207, 0.491], [0.413, 0.422], [0.825, 0.309], [0.46, 0.341], [0.821, 0.468], [0.705, 0.518], [0.3, 0.12], [0.62, 0.08], [0.18, 0.18], [0.55, 0.2], [0.86, 0.14]]
const OPENING = { kind: 'bright', ms: 4800, glow: { kind: 'stars', pts: STARS } }

export default function NightSkyTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'dark', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, weight: 300, italic: true, inlineSize: 'clamp(40px, 11.5vw, 54px)' },
    ornament: '✦', countdown: 'orbit', seat: 'circle', program: 'list', detail: 'full', gallery: 'circle', numWeight: 300, headWeight: 300,
    map: { opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.45) brightness(.82) contrast(.95)', tintOpacity: 0.18, tint: C.BG, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
