import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   KƏLAĞAYI — lüks xına seriyası (2026-11, foto redizayn)

   İpək kəlağayı — basma buta naxışı, zəfəran, qırmızı və indigo, Şəki şəbəkəsi; açılışda qatlanmış kəlağayının dörd ucu kənarlara açılır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/kl-*). Əvvəlki dizayn legacy/v2/kelagayi-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('kelagayi')
const ID = 'kelagayi'

const LINKS = { primary: ['ACCENT', 'CRIMSON'], secondary: ['INDIGO'], accent: ['SAFFRON'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'zoom', ms: 5000, overlay: { kind: 'fold', saffron: '#E0A526', light: '#F3C766', crimson: '#9E1F32', indigo: '#24305E' } }

export default function KelagayiTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 400, lh: 1.1, inlineSize: 'clamp(32px, 9vw, 42px)', inlineMax: 12 },
    heroAlign: 'left', ornament: '◆', countdown: 'rhomb', seat: 'ticket', program: 'card', detail: 'inset', gallery: 'rect', btnRadius: 0, cardRadius: 0,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
