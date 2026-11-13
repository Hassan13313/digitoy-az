import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   BISTRO SIGN — lüks açılış və təqdimat seriyası (2026-11, foto redizayn)

   Kafe və bistro açılışı — zolaqlı tente, asma lövhə, işıq girləndi; açılışda lövhə yellənib çevrilir, sonra tente ilə birlikdə yuxarı qalxır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/bs-*). Əvvəlki dizayn legacy/v2/bistro-sign-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('bistro-sign')
const ID = 'bistro-sign'

const LINKS = { primary: ['ACCENT'], secondary: ['MUTE'], accent: ['GOLD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 4800, overlay: { kind: 'awning', wall: '#F4ECDC', green: '#1F4D3A', cream: '#F4ECDC', gold: '#C9A04A', font: "'Playfair Display', serif" } }

export default function BistroSignTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'left', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 600, italic: true, lh: 1.05, inlineSize: 'clamp(38px, 11vw, 52px)' },
    heroAlign: 'left', ornament: '☕', countdown: 'saucer', seat: 'circle', program: 'list', detail: 'inset', gallery: 'circle', headItalic: true, headWeight: 600,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
