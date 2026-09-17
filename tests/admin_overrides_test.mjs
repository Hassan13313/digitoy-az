/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN OVERRIDE TESTİ (Phase 42)

   «Invitation Content Manager» dəvətnamənin `form_data.admin` açarına yazır
   və render anında şablonun üstünə qoyulur. Bu testin qoruduğu müqavilələr:

     1. GERİYƏ UYĞUNLUQ — override yoxdursa EYNİ obyekt referansı qayıdır.
        Bu, sadəcə gözəllik deyil: referans dəyişsə `TemplateRenderer`-dəki
        `useMemo` sınar və `useGallery`/`useRsvp` hər render-də təkrar işə
        düşərdi (bax TemplateRenderer-dəki şərh).

     2. TƏHLÜKƏSİZLİK — admin panelindən gələn dəyər birbaşa CSS-ə düşür.
        Rəng yalnız `#RRGGBB`, şrift yalnız reyestrdəki ailə, ölçü yalnız
        dar diapazon. Zibil dəyər SƏSSİZCƏ atılmalıdır, ötürülməməlidir.

     3. BİRLƏŞDİRMƏ — admin yalnız DOLDURDUĞU sahəni əvəz edir; qalan
        mətn/rəng şablonun (və ya sistemin) öz dəyərində qalır.
   ───────────────────────────────────────────────────────────────────────── */
import {
  normalizeOverrides, applyThemeOverrides, mergeSectionLabels, readOverrides,
  safeColor, safeFont, safeScale, safeText,
  THEME_KEYS, FONT_SCALE_MIN, FONT_SCALE_MAX,
} from '../src/data/adminOverrides.js'
import { FONT_STACKS } from '../src/templates/templateConfig.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}

/* ── 1. Geriyə uyğunluq — override yoxdursa heç nə dəyişmir ───────────── */
const THEME = { primary: '#C5A059', accent: '#E8D5A3', background: '#FDFAF4', text: '#1A1A1A', fonts: { heading: 'X', body: 'Y' } }

ok('override yoxdursa EYNİ referans', applyThemeOverrides(THEME, null) === THEME)
ok('boş override → EYNİ referans', applyThemeOverrides(THEME, {}) === THEME)
ok('yalnız labels olanda theme toxunulmur', applyThemeOverrides(THEME, { labels: { hero: {} } }) === THEME)
ok('admin açarı yoxdursa readOverrides null', readOverrides({ brideName: 'A' }) === null)
ok('boş admin → null', readOverrides({ admin: {} }) === null)
ok('zibil admin → null', readOverrides({ admin: { zzz: 1 } }) === null)
ok('sectionLabels: override yoxdursa şablonunku qayıdır',
   mergeSectionLabels({ hero: { kicker: 'A' } }, null).hero.kicker === 'A')

/* ── 2. Təhlükəsizlik — yoxlayıcılar ──────────────────────────────────── */
ok('hex qəbul olunur', safeColor('#aabbcc') === '#AABBCC')
ok('3 simvollu hex RƏDD', safeColor('#abc') === null)
ok('ad ilə rəng RƏDD', safeColor('red') === null)
ok('CSS funksiyası RƏDD', safeColor('rgb(1,2,3)') === null)
ok('inyeksiya cəhdi RƏDD', safeColor('#fff;}body{display:none') === null)
ok('url() RƏDD', safeColor('url(javascript:alert(1))') === null)

ok('reyestrdəki şrift qəbul', safeFont('cormorant') === 'cormorant')
ok('naməlum şrift RƏDD', safeFont('Comic Sans') === null)
ok('stack özü RƏDD (yalnız açar)', safeFont("'X', serif") === null)

ok('əmsal aşağı sərhədə sıxılır', safeScale(0.1) === FONT_SCALE_MIN)
ok('əmsal yuxarı sərhədə sıxılır', safeScale(99) === FONT_SCALE_MAX)
ok('ədəd olmayan əmsal null', safeScale('böyük') === null)

ok('mətn kəsilir', safeText('x'.repeat(500), 10).length === 10)
ok('boş mətn null', safeText('   ') === null)
ok('artıq boşluqlar yığılır', safeText('  a   b  ') === 'a b')

/* Normalizasiya zibili atmalıdır */
const dirty = normalizeOverrides({
  theme: { primary: '#123456', accent: 'red', surface: '#000000', text: '#ABCDEF' },
  fonts: { heading: 'cinzel', body: 'Hacker', headingScale: 5, bodyScale: 1 },
  labels: { program: { kicker: 'sched', title: { az: 'Cədvəl', xx: 'nope', en: '' } },
            hackSection: { title: { az: 'bad' } } },
})
ok('etibarsız rəng atıldı', !('accent' in dirty.theme))
ok('ağ siyahıda olmayan token atıldı (surface)', !('surface' in dirty.theme))
ok('etibarlı rənglər qaldı', dirty.theme.primary === '#123456' && dirty.theme.text === '#ABCDEF')
ok('naməlum şrift atıldı', !('body' in dirty.fonts))
ok('etibarlı şrift qaldı', dirty.fonts.heading === 'cinzel')
ok('əmsal sərhədə sıxıldı', dirty.fonts.headingScale === FONT_SCALE_MAX)
ok('1.0 əmsal saxlanılmır (JSON şişməsin)', !('bodyScale' in dirty.fonts))
ok('naməlum bölmə atıldı', !('hackSection' in dirty.labels))
ok('naməlum dil atıldı', !('xx' in dirty.labels.program.title))
ok('boş dil saxlanılmır', !('en' in dirty.labels.program.title))
ok('kicker BÖYÜK hərfə çevrilir', dirty.labels.program.kicker === 'SCHED')

/* THEME_KEYS-dən kənar açar heç vaxt keçməməlidir */
const all = normalizeOverrides({ theme: Object.fromEntries(
  ['primary', 'secondary', 'accent', 'background', 'text', 'muted', 'footerBg', 'surface']
    .map((k) => [k, '#111111'])) })
ok('yalnız ağ siyahıdakı tokenlər keçir',
   Object.keys(all.theme).every((k) => THEME_KEYS.includes(k)) &&
   Object.keys(all.theme).length === THEME_KEYS.length,
   Object.keys(all.theme).join(','))

/* ── 3. Tətbiq — rəng və şrift ────────────────────────────────────────── */
const applied = applyThemeOverrides(THEME, {
  theme: { primary: '#FF0000' },
  fonts: { heading: 'cinzel', headingScale: 1.1, bodyScale: 0.9 },
})
ok('override edilən rəng dəyişdi', applied.primary === '#FF0000')
ok('override edilməyən rəng qaldı', applied.accent === THEME.accent)
ok('şrift STACK-ə çevrildi', applied.fonts.heading === FONT_STACKS.cinzel)
ok('override edilməyən şrift qaldı', applied.fonts.body === 'Y')
ok('əmsallar theme-ə köçdü', applied.headingScale === 1.1 && applied.bodyScale === 0.9)
ok('orijinal theme MUTASİYA olunmadı', THEME.primary === '#C5A059' && THEME.fonts.heading === 'X')

/* ── 4. Bölmə adlarının birləşməsi ────────────────────────────────────── */
const merged = mergeSectionLabels(
  { program: { kicker: 'SCHEDULE', title: { az: 'Uçuş cədvəli', en: 'Flight schedule', ru: 'Расписание' } },
    venue:   { kicker: 'GATE', title: { az: 'Gate' } } },
  { labels: { program: { title: { en: 'My schedule' } } } },
)
ok('admin yalnız yazdığı dili əvəz edir', merged.program.title.en === 'My schedule')
ok('yazılmayan dil şablonunku qalır', merged.program.title.az === 'Uçuş cədvəli')
ok('yazılmayan dil (ru) şablonunku qalır', merged.program.title.ru === 'Расписание')
ok('toxunulmayan bölmə olduğu kimi', merged.venue.kicker === 'GATE')
ok('şablonun kicker-i qorunur', merged.program.kicker === 'SCHEDULE')

/* Şablonun heç bir adı olmasa da admin-inki tətbiq olunur */
const onlyAdmin = mergeSectionLabels(null, { labels: { hero: { title: { az: 'Salam' } } } })
ok('şablon adsız olsa da admin işləyir', onlyAdmin.hero.title.az === 'Salam')

console.log(fail === 0
  ? 'Admin override qatı: bütün yoxlamalar keçdi (geriyə uyğunluq + təhlükəsizlik)'
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
