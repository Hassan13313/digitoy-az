/* ─────────────────────────────────────────────────────────────────────────────
   MƏZMUN TƏRCÜMƏSİ (Phase 36) — istifadəçinin builder-də yazdığı mətnlər.

   PROBLEM: `translations.js` yalnız SİSTEM mətnlərini (RSVP, Proqram, Məkan…)
   tərcümə edirdi. Dil dəyişəndə cütlüyün öz yazdığı məkan adı, məkan qeydi,
   geyim kodu izahı və proqram sətirləri Azərbaycanca qalırdı — yəni EN/RU
   dəvətnamə yarımçıq görünürdü.

   HƏLL — ÜÇ PİLLƏLİ, HƏMİŞƏ FALLBACK-Lİ:
     1. ƏL İLƏ TƏRCÜMƏ  — `weddingData.i18n[lang][field]` (admin paneldən)
     2. LÜĞƏT           — toy sektoru üçün seçilmiş ifadələr (aşağıda)
     3. ORİJİNAL MƏTN   — heç nə tapılmasa AZ mətn olduğu kimi qalır

   ⚠ GERİYƏ UYĞUNLUQ: `i18n` açarı OLMAYAN bütün köhnə dəvətnamələr
   AZ dilində EYNİ OBYEKT referansı ilə qayıdır (bax `resolveWeddingContent`),
   yəni render ağacı dəyişmir, remount olmur, heç bir davranış fərqlənmir.

   ⚠ ADLAR: gəlin/bəy adları MAŞIN İLƏ TƏRCÜMƏ OLUNMUR — yalnız admin
   açıq-aşkar `i18n.ru.brideName` yazsa dəyişir (kiril yazılışı üçün).

   ⚠ OTURMA PLANI və QONAQ ADLARI toxunulmur: onlar axtarış açarıdır,
   tərcümə edilsə qonaq öz masasını tapa bilməz.
   ───────────────────────────────────────────────────────────────────────── */

export const CONTENT_LANGS = ['en', 'ru']

/* Admin redaktorunda göstərilən sadə mətn sahələri (sıra = redaktordakı sıra) */
export const TRANSLATABLE_FIELDS = [
  { key: 'eventName',            az: 'Tədbirin adı' },
  { key: 'organizer',            az: 'Təşkilatçı' },
  { key: 'brideName',            az: 'Gəlinin adı' },
  { key: 'groomName',            az: 'Bəyin adı' },
  { key: 'venueName',            az: 'Məkan adı' },
  { key: 'venueNote',            az: 'Məkan qeydi' },
  { key: 'dressCodeDescription', az: 'Geyim kodu izahı' },
]

/* ── Lüğət ──
   Söz-söz tərcümə YOX: toy sektorunda REAL işlənən terminlər seçilib
   (Wedding Ceremony / Свадебная церемония, Guest Reception / Приём гостей…).
   Açarlar normallaşdırılmış AZ mətnidir (kiçik hərf, artıq boşluqsuz). */
const PHRASES = {
  /* ── Proqram sətirləri ── */
  'qonaqların qarşılanması':  { en: 'Guest Reception',        ru: 'Приём гостей' },
  'qonaqların gəlişi':        { en: 'Guest Arrival',          ru: 'Прибытие гостей' },
  'qarşılanma':               { en: 'Welcome',                ru: 'Встреча' },
  'nikah mərasimi':           { en: 'Wedding Ceremony',       ru: 'Свадебная церемония' },
  'kəbin mərasimi':           { en: 'Marriage Ceremony',      ru: 'Церемония бракосочетания' },
  'toy mərasimi':             { en: 'Wedding Ceremony',       ru: 'Свадебная церемония' },
  'nişan mərasimi':           { en: 'Engagement Ceremony',    ru: 'Церемония помолвки' },
  'ziyafətin başlanması':     { en: 'Reception Begins',       ru: 'Начало банкета' },
  'ziyafət':                  { en: 'Reception',              ru: 'Банкет' },
  'şam yeməyi':               { en: 'Dinner',                 ru: 'Ужин' },
  'nahar':                    { en: 'Lunch',                  ru: 'Обед' },
  'rəqs proqramı':            { en: 'Dance Program',          ru: 'Танцевальная программа' },
  'ilk rəqs':                 { en: 'First Dance',            ru: 'Первый танец' },
  'tortun kəsilməsi':         { en: 'Cake Cutting',           ru: 'Разрезание торта' },
  'tort kəsilməsi':           { en: 'Cake Cutting',           ru: 'Разрезание торта' },
  'buket atma':               { en: 'Bouquet Toss',           ru: 'Бросание букета' },
  'hədiyyə təqdimatı':        { en: 'Gift Presentation',      ru: 'Вручение подарков' },
  'foto sessiya':             { en: 'Photo Session',          ru: 'Фотосессия' },
  'fotosessiya':              { en: 'Photo Session',          ru: 'Фотосессия' },
  'əyləncə proqramı':         { en: 'Entertainment',          ru: 'Развлекательная программа' },
  'canlı musiqi':             { en: 'Live Music',             ru: 'Живая музыка' },
  'açılış nitqi':             { en: 'Opening Speech',         ru: 'Приветственная речь' },
  'qeydiyyat':                { en: 'Registration',           ru: 'Регистрация' },
  'yola salma':               { en: 'Farewell',               ru: 'Проводы' },
  'bəy və gəlinin gəlişi':    { en: 'Arrival of the Couple',  ru: 'Прибытие молодожёнов' },
  'şirniyyat masası':         { en: 'Dessert Table',          ru: 'Сладкий стол' },
  'kokteyl':                  { en: 'Cocktail Hour',          ru: 'Коктейль' },
  'salyut':                   { en: 'Fireworks',              ru: 'Салют' },
  'proqram':                  { en: 'Program',                ru: 'Программа' },

  /* ── Geyim kodu izahları ── */
  'rəsmi geyim':              { en: 'Formal Attire',          ru: 'Официальный наряд' },
  'klassik kostyum':          { en: 'Classic Suit',           ru: 'Классический костюм' },
  'axşam geyimi':             { en: 'Evening Wear',           ru: 'Вечерний наряд' },
  'ağ rəngdən çəkinin':       { en: 'please avoid white',     ru: 'просим воздержаться от белого' },
  'pastel çalarlar':          { en: 'pastel shades',          ru: 'пастельные оттенки' },

  /* ── Məkan sözləri (kompozisiya üçün) ── */
  'şadlıq sarayı':            { en: 'Wedding Hall',           ru: 'Банкетный зал' },
  'şadlıq evi':               { en: 'Wedding House',          ru: 'Дом торжеств' },
  'restoran':                 { en: 'Restaurant',             ru: 'Ресторан' },
  'hotel':                    { en: 'Hotel',                  ru: 'Отель' },
  'zal':                      { en: 'Hall',                   ru: 'Зал' },
  'mərtəbə':                  { en: 'floor',                  ru: 'этаж' },
  'bağ':                      { en: 'Garden',                 ru: 'Сад' },
  'terras':                   { en: 'Terrace',                ru: 'Терраса' },
  'giriş':                    { en: 'Entrance',               ru: 'Вход' },
  'ünvan':                    { en: 'Address',                ru: 'Адрес' },
  'bakı':                     { en: 'Baku',                   ru: 'Баку' },
}

/** Lüğət açarı formatı: kiçik hərf (az lokal), artıq boşluq/nöqtəsiz */
function normalizeKey(str) {
  return String(str || '')
    .toLocaleLowerCase('az')
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/* Lüğət açarları uzunluğa görə sıralanır — «şadlıq sarayı» «zal»-dan
   ƏVVƏL yoxlanılsın deyə (uzun ifadə qısa sözü udmasın). */
const PHRASE_KEYS = Object.keys(PHRASES).sort((a, b) => b.length - a.length)

/**
 * Bir mətn parçasını lüğətlə tərcümə et.
 * Əvvəl TAM uyğunluq (ən keyfiyyətli nəticə), sonra ifadə-səviyyəli əvəzləmə.
 * Heç nə tapılmasa `null` — çağıran orijinal mətni saxlayır.
 */
export function translatePhrase(text, lang) {
  if (!text || typeof text !== 'string') return null
  if (!CONTENT_LANGS.includes(lang)) return null

  const key = normalizeKey(text)
  if (!key) return null

  /* 1) Tam uyğunluq — ən keyfiyyətli nəticə */
  const exact = PHRASES[key]
  if (exact && exact[lang]) return exact[lang]

  /* 2) İfadə-səviyyəli əvəzləmə — «Gülüstan Şadlıq Sarayı» və «Zal 2,
        3-cü mərtəbə» kimi qarışıq mətnlər üçün.

        ⚠ FRANKEN-MƏTN QORUYUCUSU: sərbəst cümlədə yalnız bir neçə söz
        tanınsa nəticə yarı-AZ yarı-EN olur («Xahiş edirik please avoid
        white») — bu, tərcüməsiz mətndən DAHA PİSdir. Ona görə əvəzləmə
        yalnız o halda qəbul edilir ki, tərcümə olunmamış QALIQ sözlərin
        hamısı xüsusi ad və ya rəqəm olsun. Əks halda `null` qayıdır və
        mətn bütöv Azərbaycanca qalır — yarımçıq deyil, sadəcə tərcüməsiz. */
  const mk = (k) => new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRe(k)})(?=$|[^\\p{L}\\p{N}])`, 'giu')
  let out = text
  let leftover = text
  let hit = false
  for (const k of PHRASE_KEYS) {
    const val = PHRASES[k][lang]
    if (!val) continue
    if (!mk(k).test(out)) continue
    hit = true
    out = out.replace(mk(k), (_m, pre) => pre + val)
    /* Qalıq: tanınan ifadələr çıxarılmış orijinal mətn */
    leftover = leftover.replace(mk(k), (_m, pre) => pre + ' ')
  }
  if (!hit || !leftoverIsNamesOnly(leftover)) return null

  return localizeOrdinals(out, lang)
}

/** Tərcümə olunmamış qalıqda yalnız xüsusi ad / rəqəm varmı? */
function leftoverIsNamesOnly(leftover) {
  const tokens = String(leftover).split(/[^\p{L}\p{N}-]+/u).filter(Boolean)
  return tokens.every((tok) => {
    if (/^\d+(?:[-–]\p{L}+)?$/u.test(tok)) return true       /* 2 · 3-cü */
    const first = tok[0]
    /* Böyük hərflə başlayan söz = xüsusi ad sayılır (Gülüstan, Baku Marriott) */
    return first === first.toLocaleUpperCase('az')
        && first !== first.toLocaleLowerCase('az')
  })
}

/** «3-cü mərtəbə» → EN «3rd floor», RU «3-й этаж» */
function localizeOrdinals(text, lang) {
  /* ⚠ `\b` İŞLƏMİR: ASCII əsaslıdır, «3-cü»-dəki `ü` söz simvolu sayılmır və
     sərhəd yanlış yerdə tapılır. Ona görə açıq unicode lookahead işlədilir. */
  return String(text).replace(/(\d+)[-–](?:inci|ıncı|uncu|üncü|ci|cı|cu|cü)(?![\p{L}\p{N}])/giu, (_m, n) => {
    if (lang === 'ru') return `${n}-й`
    const num  = parseInt(n, 10)
    const tens = num % 100
    if (tens >= 11 && tens <= 13) return `${n}th`
    const ones = num % 10
    return `${n}${ones === 1 ? 'st' : ones === 2 ? 'nd' : ones === 3 ? 'rd' : 'th'}`
  })
}

/** Sahə üçün yekun mətn: əl ilə tərcümə → lüğət → orijinal */
function pickField(original, manual, lang) {
  if (typeof manual === 'string' && manual.trim()) return manual
  const auto = translatePhrase(original, lang)
  return auto || original
}

/**
 * Dəvətnamə məzmununu seçilmiş dilə uyğunlaşdır.
 *
 * ⚠ `az` dilində və ya tərcüməyə səbəb olmayan hallarda EYNİ OBYEKT
 * referansı qaytarılır — React ağacı bunu dəyişiklik saymır, remount olmur.
 *
 * @param {object} weddingData  builder/DB-dən gələn orijinal obyekt
 * @param {string} lang         'az' | 'en' | 'ru'
 * @returns {object}            render üçün hazır obyekt
 */
export function resolveWeddingContent(weddingData, lang) {
  if (!weddingData || !CONTENT_LANGS.includes(lang)) return weddingData

  const manual = (weddingData.i18n && weddingData.i18n[lang]) || {}
  const out = { ...weddingData }
  let changed = false

  /* ── Sadə mətn sahələri ── */
  for (const { key } of TRANSLATABLE_FIELDS) {
    const original = weddingData[key]
    if (typeof original !== 'string' || !original.trim()) continue
    /* Adlar YALNIZ əl ilə tərcümə olunur (maşın adları korlayır) */
    const isName = key === 'brideName' || key === 'groomName'
    const value = isName
      ? (typeof manual[key] === 'string' && manual[key].trim() ? manual[key] : original)
      : pickField(original, manual[key], lang)
    if (value !== original) { out[key] = value; changed = true }
  }

  /* ── Proqram sətirləri ──
     `i18n[lang].programSteps` indeksə görə obyektdir. Vaxt sütunu
     TOXUNULMUR — yalnız `activity` mətni. */
  if (Array.isArray(weddingData.programSteps) && weddingData.programSteps.length) {
    const mp = manual.programSteps || {}
    let stepsChanged = false
    const steps = weddingData.programSteps.map((row, i) => {
      const original = row && row.activity
      if (typeof original !== 'string' || !original.trim()) return row
      const value = pickField(original, mp[i] !== undefined ? mp[i] : mp[String(i)], lang)
      if (value === original) return row
      stepsChanged = true
      return { ...row, activity: value }
    })
    if (stepsChanged) { out.programSteps = steps; changed = true }
  }

  /* ── Geyim kodu kartlarının fərdi adları: { [paletteId]: 'Black Tie' } ── */
  if (weddingData.dressCodeLabels && typeof weddingData.dressCodeLabels === 'object') {
    const ml = manual.dressCodeLabels || {}
    const next = {}
    let labelsChanged = false
    for (const [pid, original] of Object.entries(weddingData.dressCodeLabels)) {
      if (typeof original !== 'string' || !original.trim()) { next[pid] = original; continue }
      const value = pickField(original, ml[pid], lang)
      next[pid] = value
      if (value !== original) labelsChanged = true
    }
    if (labelsChanged) { out.dressCodeLabels = next; changed = true }
  }

  /* ── Geyim kodu kişi/qadın mətnləri: { [paletteId]: { male, female } } ── */
  if (weddingData.dressCodeGenders && typeof weddingData.dressCodeGenders === 'object') {
    const mg = manual.dressCodeGenders || {}
    const next = {}
    let gendersChanged = false
    for (const [pid, pair] of Object.entries(weddingData.dressCodeGenders)) {
      if (!pair || typeof pair !== 'object') { next[pid] = pair; continue }
      const mPair = mg[pid] || {}
      const male = typeof pair.male === 'string' && pair.male.trim()
        ? pickField(pair.male, mPair.male, lang) : pair.male
      const female = typeof pair.female === 'string' && pair.female.trim()
        ? pickField(pair.female, mPair.female, lang) : pair.female
      next[pid] = { ...pair, male, female }
      if (male !== pair.male || female !== pair.female) gendersChanged = true
    }
    if (gendersChanged) { out.dressCodeGenders = next; changed = true }
  }

  return changed ? out : weddingData
}

export default resolveWeddingContent
