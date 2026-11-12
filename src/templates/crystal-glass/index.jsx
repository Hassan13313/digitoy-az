import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   CRYSTAL GLASS — lüks toy seriyası (2026-11, foto redizayn)

   Kristal çilçıraqlar, prizmadan düşən göy qurşağı işığı, ağ mərmər; açılışda dairəvi pəncərə çilçıraqdan bütün ekrana açılır, kristallar parlayır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/cg-*). Köhnə sifarişlər pozulmur:
   id və açılış sahələri (openingSpec) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('crystal-glass')
const ID = 'crystal-glass'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['ACCENT'], background: ['BG'], text: ['INK'] }

/* cg-1 fotosunda işıq nöqtələri (0..1) */
const IRIS = [0.5, 0.44]
const CRYSTAL = [[0.5, 0.12], [0.42, 0.22], [0.58, 0.24]]
const OPENING = { kind: 'iris', ms: 4600, origin: IRIS, glow: { kind: 'bloom', pts: CRYSTAL, color: 'rgba(255,255,255,.85)', size: '70vw' } }

export default function CrystalGlassTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 300, upper: true, track: '.08em', lh: 1.15, inlineSize: 'clamp(30px, 8.6vw, 40px)', inlineMax: 12 },
    mono: true, ornament: '✧', countdown: 'glass', seat: 'circle', program: 'list', detail: 'full', gallery: 'rect', headUpper: true, headWeight: 300, numWeight: 200, captionShade: '#23303B', captionInk: '#F9FBFC',
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
