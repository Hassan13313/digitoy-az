import { getTemplateTheme } from '../templateConfig'
import { useInvitation } from '../_shared/useInvitation'
import { PaletteContext, resolvePalette } from '../_shared/palette'
import LuxeTemplate from '../_shared/luxe/LuxeTemplate'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   GENDER REVEAL — lüks baby shower seriyası (2026-11, foto redizayn)

   Oğlan, yoxsa qız? — mavi və çəhrayı, hədiyyə qutusu, şarlar; açılışda zolaqlı qutunun qapağı uçur, içindən mavi və çəhrayı şarlar qalxır.
   Quruluş və funksiyalar ümumi mühərrikdədir (_shared/luxe/LuxeTemplate.jsx);
   bu fayl yalnız şablonun öz görünüşünü verir. Fotolar GPT Image ilə bu şablon
   üçün yaradılıb (public/img/wedding/viral/gr-*). Əvvəlki dizayn legacy/v2/gender-reveal-də
   dondurulub — artıq yaradılmış dəvətnamələr köhnə görünüşdə qalır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('gender-reveal')
const ID = 'gender-reveal'

const LINKS = { primary: ['ACCENT', 'INK'], secondary: ['MUTE'], accent: ['GOLD'], background: ['BG'], text: ['INK'] }

const OPENING = { kind: 'still', ms: 5000, overlay: { kind: 'giftbox', bg: '#FFFBF7', pink: '#F2A7BD', blue: '#9CC8EA', gold: '#E9C46A' } }

export default function GenderRevealTemplate(props) {
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const T = inv.copy(TXT)
  const f = inv.theme.fonts
  const cfg = {
    id: ID, photos: PHOTOS, nameSize, tone: 'light', align: 'center', opening: OPENING,
    fonts: { head: f.heading, body: f.body, caps: f.heading, num: f.heading },
    names: { font: f.heading, weight: 700, lh: 1.05, inlineSize: 'clamp(36px, 10vw, 48px)' },
    ornament: '?', countdown: 'split', seat: 'ticket', program: 'card', detail: 'full', gallery: 'circle', headWeight: 700, numWeight: 700, cardRadius: 18, btnRadius: 999,
    map: { opacity: 0.9, filter: 'grayscale(1) sepia(.2) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.ACCENT, blend: 'multiply' },
  }
  const text = { brand: T.brand, line: T.line, table: T.table, end: T.end, scroll: T.scroll }
  return <PaletteContext.Provider value={C}><LuxeTemplate props={props} inv={inv} C={C} T={text} cfg={cfg} /></PaletteContext.Provider>
}
