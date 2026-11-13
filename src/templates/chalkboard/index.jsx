import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   CHALKBOARD — lüks məzuniyyət seriyası (2026-11, foto redizayn)

   Məzuniyyət — taxta çərçivəli yaşıl lövhə, təbaşir; açılışda lövhədə təbaşir cizgiləri çəkilir, sonra silgi lövhəni silib keçir.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/cb-*). Əvvəlki dizayn legacy/v2/chalkboard-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('chalkboard')
const ID = 'chalkboard'

const LINKS = { primary: ['ACCENT', 'BOARD'], secondary: ['MUTE'], accent: ['YEL'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'chalk', wall: '#F3ECDD', board: '#26453D', wood: '#8C5A2B', chalk: '#F4F1EA', yellow: '#F5DE7A' } }

export default function ChalkboardTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.body, num: f.heading },
    names: { font: f.heading, weight: 700, lh: 1.0, inlineSize: 'clamp(46px, 13vw, 62px)', inlineMax: 12 },
    heroAlign: 'left', ornament: '✎', countdown: 'chalkbox', seat: 'card', program: 'list', detail: 'inset', gallery: 'rect', headWeight: 700, cardRadius: 4,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
