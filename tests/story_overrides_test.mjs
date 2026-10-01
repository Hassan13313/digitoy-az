/* ─────────────────────────────────────────────────────────────────────────────
   «BİZİM HEKAYƏMİZ» ADMIN OVERRIDE TESTİ (Phase 45)

   Admin panelinin «Love Story» redaktoru müştərinin `loveStory` massivinə
   TOXUNMUR — dəyişikliklər `form_data.admin.story`-dədir və render anında
   `applyStoryOverrides` ilə üstünə qoyulur. Bu test qoruyur:
     1. GERİYƏ UYĞUNLUQ — override yoxdursa EYNİ referans (remount yox).
     2. Mətn override-ı, gizlətmə, tarix/stiker gizlətmə, şəkil siyahısı.
     3. Dil zənciri: admin dili → dəvətnamənin öz tərcüməsi → admin AZ → müştəri.
     4. Yeni fəsillər və normallaşdırma (zibil atılır, emoji bütöv qalır).
     5. Bölmə başlıqları (storyCopyWithOverrides).

   İşə salmaq: node tests/story_overrides_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import {
  normalizeStory, applyStoryOverrides, storyCopyWithOverrides, normalizeOverrides, safeText, safeLongText,
} from '../src/data/adminOverrides.js'
import { resolveWeddingContent } from '../src/data/contentI18n.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const P0 = '/uploads/_story/a1b2c3d4e5f60718293a4b5c/0123456789abcdef0123.jpg'
const P1 = '/uploads/_story/a1b2c3d4e5f60718293a4b5c/1123456789abcdef0123.jpg'
const NEW = '/uploads/_admin/zz-test/2123456789abcdef0123.png'

const wd = {
  eventType: 'toy',
  loveStory: [
    { id: 'a', date: '2019-06', icon: '☕', title: 'İlk görüş', text: 'Bulvarda.', caption: 'ilk baxış', photos: [P0, P1] },
    { id: 'b', date: '2021', icon: '✈️', title: 'Səyahət', text: 'Qəbələ.', photos: [] },
    { id: 'c', title: 'Nişan', text: 'Qar yağırdı.', photo: 'data:image/jpeg;base64,AAAA' },
  ],
  i18n: { en: { loveStory: { 0: { title: 'First meeting' } } } },
}

/* ── 1. Geriyə uyğunluq ── */
ok('override yoxdursa EYNİ referans', applyStoryOverrides(wd, null, 'az') === wd)
ok('boş story → EYNİ referans', applyStoryOverrides(wd, {}, 'az') === wd)
ok('yalnız başlıq mətni → loveStory toxunulmur', applyStoryOverrides(wd, { text: { title: { az: 'X' } } }, 'az') === wd)
eq('normalizeOverrides zibil story → null', normalizeOverrides({ story: { ch: { zz: 1 }, add: [{}] } }), null)

/* ── 2. Fəsil override-ları ── */
const story = normalizeStory({
  ch: {
    c0: { title: { az: 'Tanışlıq', ru: 'Знакомство' }, date: false, icon: '💛', photos: [1, NEW] },
    c1: { hide: true },
    c2: { icon: false, text: { az: 'Qar yağırdı\n\n\nvə o «hə» dedi.' } },
  },
  add: [{ id: 'adm_1', title: { az: 'Toy hazırlığı', en: 'Getting ready' }, text: { az: 'Admin fəsli' }, photos: [NEW], date: '2026-05', icon: '🎉' }],
})
const az = applyStoryOverrides(wd, story, 'az', wd)
eq('fəsil sayı: gizli çıxdı, yeni əlavə olundu', az.loveStory.map((c) => c.id), ['a', 'c', 'adm_1'])
eq('başlıq override', az.loveStory[0].title, 'Tanışlıq')
eq('tarix gizlədildi', az.loveStory[0].date, '')
eq('stiker dəyişdi', az.loveStory[0].icon, '💛')
eq('şəkillər: indeks 1 + yeni', az.loveStory[0].photos, [P1, NEW])
eq('toxunulmayan sahə qalır', az.loveStory[0].text, 'Bulvarda.')
eq('stiker gizlədildi', az.loveStory[1].icon, '')
eq('mətn sətir sonları normallaşdı', az.loveStory[1].text, 'Qar yağırdı\n\nvə o «hə» dedi.')
eq('Phase 43 tək şəkli toxunulmayıb', az.loveStory[1].photo, 'data:image/jpeg;base64,AAAA')
eq('yeni fəsil', [az.loveStory[2].title, az.loveStory[2].date, az.loveStory[2].icon, az.loveStory[2].photos], ['Toy hazırlığı', '2026-05', '🎉', [NEW]])
ok('müştərinin massivi DƏYİŞMƏYİB', wd.loveStory[0].title === 'İlk görüş' && wd.loveStory.length === 3)

/* ── 3. Dil zənciri ── */
const enWd = resolveWeddingContent(wd, 'en')
const en = applyStoryOverrides(enWd, story, 'en', wd)
eq('EN: admin EN yazmayıb, dəvətnamənin öz EN tərcüməsi var → o', en.loveStory[0].title, 'First meeting')
eq('EN: yeni fəsil EN mətni', en.loveStory[2].title, 'Getting ready')
eq('EN: yeni fəsil EN mətni yoxdursa AZ', en.loveStory[2].text, 'Admin fəsli')
const ruWd = resolveWeddingContent(wd, 'ru')
const ru = applyStoryOverrides(ruWd, story, 'ru', wd)
eq('RU: admin RU yazıb → o', ru.loveStory[0].title, 'Знакомство')
eq('RU: tərcümə yoxdur → admin AZ', ru.loveStory[1].text, 'Qar yağırdı\n\nvə o «hə» dedi.')

/* ── 4. Normallaşdırma ── */
const n = normalizeStory({
  ch: { 0: { title: { az: 'rəqəm açar' } }, c5: { photos: ['javascript:alert(1)', 'https://evil/x.jpg', 99, 2] } },
  add: [{ title: {} }, { text: { az: 'ok' }, hide: true, date: false, icon: false }],
})
eq('rəqəm açar atılır, c5 qalır', Object.keys(n.ch), ['c5'])
eq('təhlükəli şəkil ünvanları atılır', n.ch.c5.photos, [2])
eq('boş yeni fəsil atılır, hide/false-lar təmizlənir', n.add, [{ text: { az: 'ok' }, id: 'adm_0' }])
eq('emoji yarıdan kəsilmir', safeText('💍💍💍', 2), '💍💍')
eq('uzun mətn kəsilir', (safeLongText('a'.repeat(3000)) || '').length, 1500)
eq('nəzarət simvolu atılır', safeLongText('a\u0007b\nc'), 'a b\nc')

/* ── 5. Bölmə başlıqları ── */
const copy = { kicker: 'Hekayə', title: 'Bizim Hekayəmiz', sub: 'Yol', next: 'Növbəti', end: 'Son', endSub: 'Alt', kpre: '', photo: 'Foto' }
ok('override yoxdursa EYNİ copy', storyCopyWithOverrides(copy, null, 'az') === copy)
const c2 = storyCopyWithOverrides(copy, { title: { az: 'Nağılımız' }, end: { en: 'The end' } }, 'en')
eq('EN: yalnız AZ yazılıb → AZ (sistem qaydası)', c2.title, 'Nağılımız')
eq('EN override', c2.end, 'The end')
eq('toxunulmayan açar', c2.sub, 'Yol')

console.log(fail ? `\n${fail} yoxlama UĞURSUZ` : 'Hekayə override-ları: geriyə uyğunluq, dil zənciri və təhlükəsizlik keçdi')
process.exit(fail ? 1 : 0)
