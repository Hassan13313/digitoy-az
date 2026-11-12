/* ─────────────────────────────────────────────────────────────────────────────
   AÇILIŞ EKRANI — MƏTNLƏR VƏ MONOQRAM (Phase 45)

   NƏ ÜÇÜN: 16 şablonun hər birinin açılış ekranı öz mətnlərini birbaşa
   markup-da yazırdı («Dəvətnaməni aç», «toxunun», «Dəvətnamə», «Premyera»…).
   Nəticədə:
     • admin bu mətnləri dəyişə bilmirdi,
     • EN/RU dəvətnamədə açılış ekranı yenə Azərbaycanca qalırdı,
     • korporativ/digər tədbirdə monoqram kvadratına tədbir adının ilk hərfi
       düşürdü («Əliyev Turqayın kiçik toyu» → «Ə»).
   Bu fayl həmin mətnlərin TƏK MƏNBƏYİDİR: şablon da, admin panelinin
   «Açılış» redaktoru da defolt mətni buradan oxuyur — admin placeholder-da
   dəvətnamədə görünən mətnin EYNİSİNİ görür.

   ⚠ AZ MƏTNLƏR DƏYİŞMƏYİB: hər defolt əvvəlki markup-dakı sətirlə hərfbəhərf
   eynidir. İki istisna — ikisi də düzəlişdir:
     • Gazette rubrikası toy olmayan tədbirdə «Toy elanı» yazırdı.
     • Royal Gold / Floral Garden açılışında tarix həmişə AZ dilində idi.
   ⚠ React YOXDUR — node testləri bu faylı birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */
import { formatFullDateByLang, formatTime24 } from '../../utils/dateFormat.js'
import { parseLatLon } from './geo.js'

/* ── Sabit ifadələr (AZ/EN/RU) ── */
export const OPENING_PHRASES = {
  open:         { az: 'Dəvətnaməni aç',          en: 'Open the invitation',     ru: 'Открыть приглашение' },
  openShort:    { az: 'Dəvəti aç',               en: 'Open invitation',         ru: 'Открыть приглашение' },
  tap:          { az: 'toxunun',                 en: 'tap to open',             ru: 'коснитесь' },
  invitation:   { az: 'Dəvətnamə',               en: 'Invitation',              ru: 'Приглашение' },
  checkin:      { az: 'Check-in et',             en: 'Check in',                ru: 'Пройти регистрацию' },
  premiere:     { az: 'Premyera',                en: 'Premiere',                ru: 'Премьера' },
  openPremiere: { az: 'Premyeranı aç',           en: 'Start the premiere',      ru: 'Начать премьеру' },
  lifeFilm:     { az: 'bir ömürlük film',        en: 'a film for a lifetime',   ru: 'фильм длиною в жизнь' },
  yearFilm:     { az: 'yeni yaşın filmi',        en: 'the film of a new year',  ru: 'фильм нового года жизни' },
  playRecord:   { az: 'Plyonkanı işə sal',       en: 'Play the record',         ru: 'Включить пластинку' },
  readIssue:    { az: 'Buraxılışı oxu',          en: 'Read the issue',          ru: 'Читать выпуск' },
  specialEd:    { az: 'Xüsusi buraxılış',        en: 'Special edition',         ru: 'Специальный выпуск' },
  openBox:      { az: 'Qutunu aç',               en: 'Open the box',            ru: 'Открыть шкатулку' },
  skyNight:     { az: 'O gecə göy belə görünürdü', en: 'This is how the sky looked that night', ru: 'Таким было небо в ту ночь' },
  enterEvent:   { az: 'Tədbirə daxil olun',      en: 'Enter the event',         ru: 'Перейти к событию' },
  enterInv:     { az: 'Dəvətnaməyə daxil olun',  en: 'Open the invitation',     ru: 'Открыть приглашение' },
  and:          { az: 'VƏ',                      en: 'AND',                     ru: 'И' },
  at:           { az: 'Saat',                    en: 'At',                      ru: 'В' },
  fDate:        { az: 'Tarix',                   en: 'Date',                    ru: 'Дата' },
  fTime:        { az: 'Saat',                    en: 'Time',                    ru: 'Время' },
  fGate:        { az: 'Qapı',                    en: 'Gate',                    ru: 'Выход' },
  openSeal:     { az: 'Möhürü aç',               en: 'Break the seal',          ru: 'Открыть печать' },
  tagline:      { az: 'Bir Dəvətnamədən Daha Artığı', en: 'MORE THAN AN INVITATION', ru: 'БОЛЬШЕ, ЧЕМ ПРИГЛАШЕНИЕ' },
  skip:         { az: 'Keç →',                   en: 'Skip →',                  ru: 'Пропустить →' },
  /* Uşaq ad günü konsepti (2026-10) */
  onceUpon:     { az: 'Biri var idi, biri yox idi…', en: 'Once upon a time…',   ru: 'Жили-были…' },
  openTale:     { az: 'Nağılı aç',               en: 'Open the story',          ru: 'Открыть сказку' },
  launch:       { az: 'Raketi burax',            en: 'Launch the rocket',       ru: 'Запустить ракету' },
  rollUp:       { az: 'Diqqət, diqqət!',         en: 'Roll up, roll up!',       ru: 'Внимание, внимание!' },
  showBegin:    { az: 'Şou başlasın!',           en: 'Let the show begin!',     ru: 'Шоу начинается!' },
  hatch:        { az: 'Yumurtanı çatlat',        en: 'Hatch the egg',           ru: 'Разбить скорлупу' },
  letGo:        { az: 'Şarları burax',           en: 'Let the balloons go',     ru: 'Отпустить шарики' },
  /* konseptlər II (2026-10) */
  liftVeil: { az: 'Örpəyi qaldır', en: 'Lift the veil', ru: 'Поднять покрывало' },
  lightCandles: { az: 'Şamları yandır', en: 'Light the candles', ru: 'Зажечь свечи' },
  applyHenna: { az: 'Xınanı yax', en: 'Apply the henna', ru: 'Нанести хну' },
  lightMirror: { az: 'Güzgünü işıqlandır', en: 'Light up the mirror', ru: 'Осветить зеркало' },
  unfoldScarf: { az: 'Kəlağayını aç', en: 'Unfold the scarf', ru: 'Развернуть платок' },
  raiseCrown: { az: 'Tacı qaldır', en: 'Raise the crown', ru: 'Поднять корону' },
  startAdventure: { az: 'Macəranı başlat', en: 'Start the adventure', ru: 'Начать приключение' },
  touchCharm: { az: 'Muncuğa toxun', en: 'Touch the charm', ru: 'Коснуться оберега' },
  takeOff: { az: 'Uçuşa başla', en: 'Take off', ru: 'На взлёт' },
  takeShot: { az: 'Zərbəni vur', en: 'Take the shot', ru: 'Пробить' },
  letBloom: { az: 'Çiçəkləri aç', en: 'Let it bloom', ru: 'Пусть расцветёт' },
  wakeTeddy: { az: 'Ayıcığı oyat', en: 'Wake the teddy', ru: 'Разбудить мишку' },
  breakSeal: { az: 'Möhürü aç', en: 'Break the seal', ru: 'Вскрыть печать' },
  spinMobile: { az: 'Mobili fırlat', en: 'Spin the mobile', ru: 'Закружить мобиль' },
  openGift: { az: 'Hədiyyəni aç', en: 'Open the gift', ru: 'Открыть подарок' },
  fillGlasses: { az: 'Qədəhləri doldur', en: 'Fill the glasses', ru: 'Наполнить бокалы' },
  goLive: { az: 'Ekranı yandır', en: 'Go live', ru: 'Включить экран' },
  unveilAward: { az: 'Mükafatı aç', en: 'Unveil the award', ru: 'Открыть награду' },
  flipCard: { az: 'Kartı çevir', en: 'Flip the card', ru: 'Перевернуть карточку' },
  switchOn: { az: 'İşıqları yandır', en: 'Switch on the lights', ru: 'Включить свет' },
  openLocket: { az: 'Medalyonu aç', en: 'Open the locket', ru: 'Открыть медальон' },
  openAlbum: { az: 'Albomu aç', en: 'Open the album', ru: 'Открыть альбом' },
  unfoldPaper: { az: 'Vərəqi aç', en: 'Unfold the paper', ru: 'Развернуть лист' },
  takePhoto: { az: 'Şəkil çək', en: 'Take a photo', ru: 'Сделать снимок' },
  untieLetters: { az: 'Məktubları aç', en: 'Untie the letters', ru: 'Развязать письма' },
  tossCaps: { az: 'Papaqları at', en: 'Toss the caps', ru: 'Подбросить шапочки' },
  signYearbook: { az: 'Albomu imzala', en: 'Sign the yearbook', ru: 'Подписать альбом' },
  ringBell: { az: 'Zəngi çal', en: 'Ring the bell', ru: 'Дать звонок' },
  writeChalk: { az: 'Lövhəyə yaz', en: 'Write on the board', ru: 'Написать на доске' },
  launchPlane: { az: 'Təyyarəni burax', en: 'Launch the plane', ru: 'Запустить самолётик' },
  grandOpening: { az: 'Təntənəli açılış', en: 'Grand opening', ru: 'Торжественное открытие' },
  cutRibbon: { az: 'Lenti kəs', en: 'Cut the ribbon', ru: 'Перерезать ленту' },
  flipSign: { az: 'Lövhəni çevir', en: 'Flip the sign', ru: 'Перевернуть табличку' },
  raiseShutter: { az: 'Jalüzü qaldır', en: 'Raise the shutter', ru: 'Поднять ролл-ставню' },
  productLaunch: { az: 'Təqdimat', en: 'Launch', ru: 'Презентация' },
  unboxProduct: { az: 'Qutunu aç', en: 'Unbox it', ru: 'Распаковать' },
  exhibitionOpening: { az: 'Sərginin açılışı', en: 'Exhibition opening', ru: 'Открытие выставки' },
  unveilArt: { az: 'Örtüyü götür', en: 'Unveil', ru: 'Снять покрывало' },
  lightBonfire: { az: 'Tonqalı yandır', en: 'Light the bonfire', ru: 'Разжечь костёр' },
  novruzFest: { az: 'Novruz bayramı', en: 'Novruz holiday', ru: 'Праздник Новруз' },
  growSemeni: { az: 'Səmənini göyərt', en: 'Let it sprout', ru: 'Прорастить семени' },
  happyNewYear: { az: 'Yeni iliniz mübarək', en: 'Happy New Year', ru: 'С Новым годом' },
  strikeMidnight: { az: 'Saatı 12-yə çatdır', en: 'Strike midnight', ru: 'Пробить полночь' },
  shakeGlobe: { az: 'Kürəni silkələ', en: 'Shake the globe', ru: 'Встряхнуть шар' },
  masqueradeBall: { az: 'Maskarad balı', en: 'Masquerade ball', ru: 'Бал-маскарад' },
  wearMask: { az: 'Maskanı tax', en: 'Put on the mask', ru: 'Надеть маску' },
  popChampagne: { az: 'Şampanı aç', en: 'Pop the champagne', ru: 'Открыть шампанское' },
  lightsOn: { az: 'İşıqları yandır!', en: 'Lights on!', ru: 'Включить свет!' },
  pillowFight: { az: 'Yastıq davası!', en: 'Pillow fight!', ru: 'Бой подушками!' },
  pajamaParty: { az: 'Pijama gecəsi', en: 'Pajama night', ru: 'Пижамная ночь' },
  parisNight: { az: 'Paris gecəsi', en: 'A night in Paris', ru: 'Ночь в Париже' },
  openHatbox: { az: 'Qutunu aç', en: 'Open the hatbox', ru: 'Открыть коробку' },
  sunsetParty: { az: 'Gün batımı gecəsi', en: 'Sunset soirée', ru: 'Вечер на закате' },
  watchSunset: { az: 'Gün batımına bax', en: 'Watch the sunset', ru: 'Смотреть закат' },
  /* 2026-11 — «Viral video» toy seriyası */
  lightTonight: { az: 'Bu gecənin işığını siz yandırın', en: 'Light up our night', ru: 'Зажгите наш вечер' },
  inviteYou: { az: 'Sizi dəvət edirik', en: 'You are invited', ru: 'Приглашаем вас' },
  liftBridalVeil: { az: 'Duvağı qaldırın', en: 'Lift the veil', ru: 'Поднять фату' },
  firstDance: { az: 'İlk rəqsimizə dəvət', en: 'Join us for our first dance', ru: 'Приглашаем на наш первый танец' },
  lightSparklers: { az: 'Fişəngləri yandır', en: 'Light the sparklers', ru: 'Зажечь бенгальские огни' },
  /* 2026-11 — lüks toy seriyası */
  ivoryKick: { az: 'Toy mərasiminə dəvət', en: 'Invitation to our wedding', ru: 'Приглашение на свадьбу' },
  bakuKick: { az: 'Bakı, toy gecəsi', en: 'Baku, a wedding night', ru: 'Баку, свадебный вечер' },
  sunsetKick: { az: 'Gün batanda toy', en: 'A sunset wedding', ru: 'Свадьба на закате' },
  winterKick: { az: 'Dağda qış toyu', en: 'A winter wedding in the mountains', ru: 'Зимняя свадьба в горах' },
}

/* Gazette rubrikası — tədbir növünə görə (əvvəl hər tədbirdə «Toy elanı» idi) */
const GAZETTE_RUBRIC = {
  toy:       { az: 'Toy elanı · Bakı',      en: 'Wedding notice · Baku',    ru: 'Свадебное объявление · Баку' },
  nishan:    { az: 'Nişan elanı · Bakı',    en: 'Engagement notice · Baku', ru: 'Объявление о помолвке · Баку' },
  birthday:  { az: 'Ad günü elanı · Bakı',  en: 'Birthday notice · Baku',   ru: 'Объявление о дне рождения · Баку' },
  corporate: { az: 'Tədbir elanı · Bakı',   en: 'Event notice · Baku',      ru: 'Объявление о событии · Баку' },
  other:     { az: 'Tədbir elanı · Bakı',   en: 'Event notice · Baku',      ru: 'Объявление о событии · Баку' },
  xina:         { az: 'Xına gecəsi elanı · Bakı', en: 'Henna night notice · Baku', ru: 'Объявление о вечере хны · Баку' },
  sunnet:       { az: 'Sünnət toyu elanı · Bakı', en: 'Celebration notice · Baku', ru: 'Объявление о празднике · Баку' },
  baby:         { az: 'Baby shower elanı · Bakı', en: 'Baby shower notice · Baku', ru: 'Объявление о бэби шауэре · Баку' },
  anniversary:  { az: 'İldönümü elanı · Bakı',    en: 'Anniversary notice · Baku', ru: 'Объявление о годовщине · Баку' },
  graduation:   { az: 'Məzuniyyət elanı · Bakı',  en: 'Graduation notice · Baku',  ru: 'Объявление о выпускном · Баку' },
  bachelorette: { az: 'Qız gecəsi elanı · Bakı',  en: 'Bachelorette notice · Baku', ru: 'Объявление о девичнике · Баку' },
}

export const OPENING_LANGS = ['az', 'en', 'ru']

/** İfadəni aktiv dildə qaytar (naməlum dil → AZ) */
export function phrase(key, lang = 'az') {
  const p = OPENING_PHRASES[key]
  return p ? (p[lang] || p.az) : ''
}

/* ── Admin panelində sahə adları ──
   Açarlar ümumidir (bütün şablonlarda eyni mənada), şablona məxsus izah
   `OPENING_SPEC[id].hints` ilə verilir. */
export const OPENING_SLOT_LABELS = {
  kicker:   'Üst yazı',
  sub:      'Əlavə sətir',
  title:    'Adlar / başlıq',
  meta:     'Tarix və məkan sətri',
  cta:      'Düymənin mətni',
  hint:     '«toxunun» ipucu',
  brand:    'Brend yazısı',
  pass:     '«Boarding pass» yazısı',
  route:    'Marşrut',
  fDate:    'Bilet sahəsi — tarix',
  fTime:    'Bilet sahəsi — saat',
  fGate:    'Bilet sahəsi — qapı',
  edition:  'Buraxılış sətri',
  masthead: 'Qəzetin adı',
  venue:    'Məkan sətri',
  no:       'Nömrə',
  and:      'Adların arasındakı bağlayıcı («&» / «VƏ»)',
  skip:     '«Keç» düyməsi',
}

/* ── Hər şablonun açılışında hansı sahələr var ──
   `mono`:
     'initials' — adların baş hərfləri göstərilən çərçivə (monoqram)
     'emblem'   — baş hərf yox, dekorativ nişan (almaz, daş, yarpaq, çiçək);
                  admin onu da mətn/stiker/şəkillə əvəz edə və ya gizlədə bilər
     null       — açılışda belə yer yoxdur
   `slots` — ekranda yuxarıdan aşağı sıra ilə (admin formu da bu sırada). */
export const OPENING_SPEC = {
  'royal-gold':      { mono: 'initials', slots: ['kicker', 'sub', 'title', 'and', 'meta', 'cta', 'hint'], hints: { sub: '«Anno …» ili' } },
  'oriental-luxe':   { mono: 'initials', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'white-elegance':  { mono: 'initials', slots: ['sub', 'title', 'and', 'meta', 'cta', 'hint'], hints: { sub: 'Monoqramın altındakı «Dəvətnamə»' } },
  'vinyl-record':    { mono: 'initials', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'royal-palace':    { mono: 'initials', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'crystal-glass':   { mono: 'emblem',   slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'luxury-jewelry':  { mono: 'emblem',   slots: ['brand', 'sub', 'kicker', 'title', 'and', 'meta', 'cta', 'hint'], hints: { brand: 'Qutunun qapağındakı yazı', sub: 'Brendin altındakı kiçik yazı' } },
  'nature-touch':    { mono: 'emblem',   slots: ['title', 'and', 'meta', 'cta', 'hint'] },
  'floral-garden':   { mono: 'emblem',   slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'boarding-pass':   { mono: null, slots: ['brand', 'pass', 'route', 'title', 'fDate', 'fTime', 'fGate', 'kicker', 'meta', 'cta', 'hint'] },
  'cinema-premiere': { mono: null, slots: ['title', 'sub', 'kicker', 'meta', 'cta', 'hint'], hints: { sub: 'Kadrın altındakı kiçik yazı' } },
  'gazette':         { mono: null, slots: ['edition', 'masthead', 'sub', 'title', 'venue', 'meta', 'cta', 'hint'], hints: { sub: 'Rubrika' } },
  'mediterranean':   { mono: null, slots: ['title', 'and', 'kicker', 'meta', 'cta', 'hint'] },
  'modern-black':    { mono: null, slots: ['brand', 'no', 'kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'night-sky':       { mono: null, slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* Uşaq ad günü konsepti (2026-10) */
  'fairy-tale':      { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'], hints: { kicker: 'Kitabın üstündəki nağıl başlanğıcı' } },
  'space-mission':   { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'circus-show':     { mono: null,     slots: ['kicker', 'sub', 'title', 'and', 'meta', 'cta', 'hint'], hints: { sub: 'Adın üstündəki lent' } },
  'dino-adventure':  { mono: null,     slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'balloon-party':   { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* Simple Luxury açılışı videodur — mətnlər yalnız video gecikəndə görünən
     afişada və «Keç» düyməsindədir. */
  'simple-luxury':   { mono: null, slots: ['brand', 'title', 'sub', 'skip'], hints: { sub: 'Afişadakı şüar', title: 'Yalnız video gecikəndə görünür' } },
  /* 2026-10 — «Xına gecəsi» konsepti */
  'red-veil': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'xonca': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'henna-buta': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'mirror-candle': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'kelagayi': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-11 — «Viral video» toy seriyası (açılış real fotodur, nişan yeri yoxdur) */
  'candle-rings': { mono: null, slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'bridal-veil': { mono: null, slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'first-dance': { mono: null, slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-11 — lüks toy seriyası: açılış örtüyün özüdür, tarix kadrda görünür */
  'ivory-silk': { mono: null, slots: ['kicker', 'title', 'cta', 'hint'] },
  'baku-night': { mono: null, slots: ['kicker', 'title', 'cta', 'hint'] },
  'golden-hour': { mono: null, slots: ['kicker', 'title', 'and', 'cta', 'hint'] },
  'shahdag': { mono: null, slots: ['kicker', 'title', 'and', 'cta', 'hint'] },
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'hero-comic': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'mashallah': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'little-pilot': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'football-star': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'teddy-bear': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'gender-reveal': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'stork-letter': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'baby-mobile': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'keynote': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'award-night': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'business-card': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'neon-party': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'golden-jubilee': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'first-paper': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'retro-polaroid': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'love-letters': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'yearbook': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'last-bell': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'chalkboard': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'paper-plane': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'bistro-sign': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'roller-shutter': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'unboxing': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'gallery-unveil': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «Bayram gecələri» konsepti */
  'novruz-bonfire': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'novruz-semeni': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'midnight-clock': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'snow-globe': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'masquerade-ball': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  /* 2026-10 — «Qız gecəsi» konsepti */
  'pink-champagne': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'disco-ball': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'pajama-spa': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'paris-night': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'boho-sunset': { mono: 'emblem', slots: ['kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
}

/** Şablonun açılış təsviri (naməlum id → simple-luxury) */
export function getOpeningSpec(templateId) {
  return OPENING_SPEC[templateId] || OPENING_SPEC['simple-luxury']
}

/* ── Köməkçilər — əvvəl hər şablonda ayrıca yazılırdı ── */

/** Məkan adının son hissəsi («Gülüstan, Bakı» → «Bakı») */
function placeOf(wd) {
  return wd.venueName ? String(wd.venueName).split(',').pop().trim() : ''
}

/** «2026-11-21» → «21 · 11 · 2026» (ayırıcı şablona görə) */
function dotDate(wd, sep) {
  return String(wd.date || '').split('-').reverse().join(sep)
}

/** Roma rəqəmi — Royal Gold-un «Anno» ili üçün */
function roman(year) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let n = Number(year) || 0
  if (n < 1 || n > 3999) return ''
  return map.reduce((out, [v, s]) => { while (n >= v) { out += s; n -= v } return out }, '')
}

/** Adlar bir sətirdə — admin placeholder-ı və `title` defoltu */
export function openingNames(wd, isCouple) {
  if (isCouple) return [wd.groomName, wd.brideName].map((s) => String(s || '').trim()).filter(Boolean).join(' & ')
  return String(wd.eventName || wd.brideName || '').trim()
}

/** Gecə səması: xəritə linkindən koordinat, yoxdursa Bakı */
function nightCoords(wd) {
  const ll = parseLatLon(wd)
  const dms = (v, pos, neg) => {
    const d = Math.floor(Math.abs(v))
    const m = Math.round((Math.abs(v) - d) * 60)
    return `${d}°${String(m).padStart(2, '0')}′${v >= 0 ? pos : neg}`
  }
  return ll ? `${dms(ll[0], 'N', 'S')} · ${dms(ll[1], 'E', 'W')}` : '40°23′N · 49°52′E'
}

/**
 * Şablonun açılış sahələrinin DEFOLT mətnləri (override tətbiq olunmamış).
 * @param {string} templateId
 * @param {{weddingData:object, lang:string, isCouple:boolean, isCorp:boolean, eventLabel:string}} ctx
 * @returns {Record<string,string>}
 */
export function openingDefaults(templateId, ctx) {
  const wd = ctx.weddingData || {}
  const lang = OPENING_LANGS.includes(ctx.lang) ? ctx.lang : 'az'
  const P = (k) => phrase(k, lang)
  const names = openingNames(wd, ctx.isCouple)
  const fullDate = formatFullDateByLang(wd.date, lang)
  /* `and` — açılışda adların arasındakı bağlayıcı (premium dizaynlarda «&») */
  const base = { title: names, and: '&', cta: P('open'), hint: P('tap') }

  switch (templateId) {
    case 'royal-gold': {
      const anno = roman(String(wd.date || '').slice(0, 4))
      return { ...base, kicker: ctx.eventLabel || '', sub: anno ? `Anno ${anno}` : '',
        meta: [fullDate, placeOf(wd)].filter(Boolean).join(' · '),
        cta: ctx.isCorp ? P('open') : P('openShort') }
    }
    case 'oriental-luxe':
      return { ...base, kicker: ctx.eventLabel || '', meta: [fullDate, placeOf(wd)].filter(Boolean).join(' · ') }
    case 'white-elegance':
      return { ...base, sub: P('invitation'), meta: dotDate(wd, ' · ') }
    case 'vinyl-record':
      return { ...base, kicker: 'Side A', meta: dotDate(wd, ' · '), cta: P('playRecord') }
    case 'royal-palace':
      return { ...base, kicker: P('invitation'), meta: dotDate(wd, ' · ') }
    case 'crystal-glass':
    case 'luxury-jewelry':
      return { ...base, kicker: P('invitation'), meta: dotDate(wd, ' · '),
        cta: templateId === 'luxury-jewelry' ? P('openBox') : P('open'),
        ...(templateId === 'luxury-jewelry' ? { brand: 'DIGITOY', sub: 'MAISON' } : {}) }
    case 'nature-touch':
      return { ...base, meta: [placeOf(wd), fullDate].filter(Boolean).join(' · ') }
    case 'floral-garden':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate,
        cta: ctx.isCorp ? P('enterEvent') : P('enterInv') }
    case 'boarding-pass':
      return { ...base, brand: 'DIGITOY AIR', pass: 'BOARDING PASS', route: ctx.isCouple ? 'GYD → ♥' : 'GYD → ★',
        fDate: P('fDate'), fTime: P('fTime'), fGate: P('fGate'),
        kicker: P('invitation'), meta: wd.venueName || '', cta: P('checkin') }
    case 'cinema-premiere':
      return { ...base, sub: wd.eventType === 'birthday' ? P('yearFilm') : P('lifeFilm'), kicker: P('premiere'),
        meta: [dotDate(wd, '.'), wd.venueName].filter(Boolean).join(' · '), cta: P('openPremiere') }
    case 'gazette': {
      const rubric = GAZETTE_RUBRIC[wd.eventType] || GAZETTE_RUBRIC.toy
      return { ...base, edition: P('specialEd'), masthead: 'THE GAZETTE',
        sub: rubric[lang] || rubric.az, venue: wd.venueName || '',
        meta: wd.time ? `${P('at')} ${wd.time}` : '', cta: P('readIssue') }
    }
    case 'mediterranean':
      return { ...base, kicker: P('invitation'), meta: [dotDate(wd, ' · '), wd.venueName].filter(Boolean).join(' · ') }
    case 'modern-black':
      return { ...base, brand: 'Digitoy', no: '№ 012', kicker: ctx.eventLabel || '', and: P('and'),
        /* Ekranda iki hissədir (tarix | məkan · saat) — override olmasa şablon
           onları ayrıca çəkir, bu sətir yalnız admin placeholder-ı üçündür. */
        meta: [dotDate(wd, '.'), [placeOf(wd).toLocaleUpperCase('az'), wd.time ? formatTime24(wd.time) : '']
          .filter(Boolean).join(' · ')].filter(Boolean).join('   '),
        cta: P('openShort') }
    case 'night-sky':
      return { ...base, kicker: P('skyNight'), meta: `${fullDate} · ${nightCoords(wd)}` }
    /* ── Uşaq ad günü konsepti ── */
    case 'fairy-tale':
      return { ...base, kicker: P('onceUpon'), meta: fullDate, cta: P('openTale') }
    case 'space-mission':
      return { ...base, kicker: ctx.eventLabel || '', meta: dotDate(wd, ' · '), cta: P('launch') }
    case 'circus-show':
      return { ...base, kicker: P('rollUp'), sub: ctx.eventLabel || '',
        meta: [fullDate, wd.time ? formatTime24(wd.time) : ''].filter(Boolean).join(' · '), cta: P('showBegin') }
    case 'dino-adventure':
      return { ...base, kicker: ctx.eventLabel || '', meta: dotDate(wd, ' · '), cta: P('hatch') }
    case 'balloon-party':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('letGo') }
    case 'red-veil':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('liftVeil') }
    case 'xonca':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('lightCandles') }
    case 'henna-buta':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('applyHenna') }
    case 'mirror-candle':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('lightMirror') }
    case 'kelagayi':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('unfoldScarf') }
    case 'candle-rings':
      return { ...base, kicker: P('lightTonight'), meta: fullDate, cta: P('lightCandles') }
    case 'bridal-veil':
      return { ...base, kicker: P('inviteYou'), meta: fullDate, cta: P('liftBridalVeil') }
    case 'first-dance':
      return { ...base, kicker: P('firstDance'), meta: fullDate, cta: P('lightSparklers') }
    case 'ivory-silk':
      return { ...base, kicker: P('ivoryKick'), cta: P('openShort') }
    case 'baku-night':
      return { ...base, kicker: P('bakuKick'), cta: P('openShort') }
    case 'golden-hour':
      return { ...base, kicker: P('sunsetKick'), cta: P('openShort') }
    case 'shahdag':
      return { ...base, kicker: P('winterKick'), cta: P('openShort') }
    case 'little-prince':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('raiseCrown') }
    case 'hero-comic':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('startAdventure') }
    case 'mashallah':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('touchCharm') }
    case 'little-pilot':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('takeOff') }
    case 'football-star':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('takeShot') }
    case 'pastel-bloom':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('letBloom') }
    case 'teddy-bear':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('wakeTeddy') }
    case 'gender-reveal':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('openGift') }
    case 'stork-letter':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('breakSeal') }
    case 'baby-mobile':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('spinMobile') }
    case 'gala-night':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('fillGlasses') }
    case 'keynote':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('goLive') }
    case 'award-night':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('unveilAward') }
    case 'business-card':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('flipCard') }
    case 'neon-party':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('switchOn') }
    case 'silver-locket':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('openLocket') }
    case 'golden-jubilee':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('openAlbum') }
    case 'first-paper':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('unfoldPaper') }
    case 'retro-polaroid':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('takePhoto') }
    case 'love-letters':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('untieLetters') }
    case 'caps-toss':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('tossCaps') }
    case 'yearbook':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('signYearbook') }
    case 'last-bell':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('ringBell') }
    case 'chalkboard':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('writeChalk') }
    case 'paper-plane':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('launchPlane') }
    case 'ribbon-cut':
      return { ...base, kicker: P('grandOpening'), meta: fullDate, cta: P('cutRibbon') }
    case 'bistro-sign':
      return { ...base, kicker: P('grandOpening'), meta: fullDate, cta: P('flipSign') }
    case 'roller-shutter':
      return { ...base, kicker: P('grandOpening'), meta: fullDate, cta: P('raiseShutter') }
    case 'unboxing':
      return { ...base, kicker: P('productLaunch'), meta: fullDate, cta: P('unboxProduct') }
    case 'gallery-unveil':
      return { ...base, kicker: P('exhibitionOpening'), meta: fullDate, cta: P('unveilArt') }
    case 'novruz-bonfire':
      return { ...base, kicker: P('novruzFest'), meta: fullDate, cta: P('lightBonfire') }
    case 'novruz-semeni':
      return { ...base, kicker: P('novruzFest'), meta: fullDate, cta: P('growSemeni') }
    case 'midnight-clock':
      return { ...base, kicker: P('happyNewYear'), meta: fullDate, cta: P('strikeMidnight') }
    case 'snow-globe':
      return { ...base, kicker: P('happyNewYear'), meta: fullDate, cta: P('shakeGlobe') }
    case 'masquerade-ball':
      return { ...base, kicker: P('masqueradeBall'), meta: fullDate, cta: P('wearMask') }
    case 'pink-champagne':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('popChampagne') }
    case 'disco-ball':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate, cta: P('lightsOn') }
    case 'pajama-spa':
      return { ...base, kicker: P('pajamaParty'), meta: fullDate, cta: P('pillowFight') }
    case 'paris-night':
      return { ...base, kicker: P('parisNight'), meta: fullDate, cta: P('openHatbox') }
    case 'boho-sunset':
      return { ...base, kicker: P('sunsetParty'), meta: fullDate, cta: P('watchSunset') }
    case 'simple-luxury':
    default:
      return { brand: 'Digitoy.az',
        title: ctx.isCouple ? names : String((ctx.isCorp ? wd.eventName : (wd.brideName || wd.eventName)) || '').trim(),
        sub: P('tagline'), skip: P('skip') }
  }
}

/* ── Monoqram ─────────────────────────────────────────────────────────────
   «Avtomatik» rejimdə nə göstərilir:
     • cütlük (toy/nişan)  → iki baş hərf, əvvəlki kimi
     • ad günü             → adın baş hərfi, əvvəlki kimi
     • korporativ / digər  → HƏRF YOX, şablonun öz ornamenti. Tədbir adının ilk
                             hərfi mənasızdır («Əliyev Turqayın…» → «Ə»).
   `null` qaytarılırsa şablon öz SVG ornamentini çəkir. */
const CORP_GLYPH = {
  'royal-gold':     '✦',
  'white-elegance': '✦',
  'vinyl-record':   '♪',
  'royal-palace':   '♛',
  'oriental-luxe':  null,   /* girih ulduzu (SVG) */
}

export function autoMonogram(templateId, ctx) {
  const wd = ctx.weddingData || {}
  if (ctx.isCorp && Object.prototype.hasOwnProperty.call(CORP_GLYPH, templateId)) {
    return CORP_GLYPH[templateId]
  }
  switch (templateId) {
    case 'vinyl-record': {
      const cut = (s) => String(s || '').trim().charAt(0).toUpperCase()
      if (ctx.isCouple) return [cut(wd.groomName), cut(wd.brideName)].filter(Boolean).join('&') || '♥'
      return cut(wd.eventName || wd.brideName) || '♥'
    }
    case 'royal-palace':
      return [wd.groomName, wd.brideName]
        .map((n) => String(n || '').trim().charAt(0).toUpperCase())
        .filter(Boolean).join(' ') || '♛'
    default:
      return ctx.isCouple
        ? `${(wd.groomName || '?')[0]}&${(wd.brideName || '?')[0]}`.toLocaleUpperCase('az')
        : ((wd.eventName || wd.brideName || '·')[0] || '·').toLocaleUpperCase('az')
  }
}

/* ── Admin override-ı + defolt → şablonun işlədəcəyi köməkçi ──────────────
   Şablon mətnləri belə soruşur: `ot.text('cta')`.
     • admin sahəni GİZLƏDİBSƏ → '' (şablon heç nə çəkmir)
     • admin aktiv dildə yazıbsa → onun mətni
     • yalnız AZ-da yazıbsa → AZ mətni (sistemin qalan override-ları ilə eyni
       qayda — bax adminOverrides.js › withStringOverrides)
     • heç nə yazmayıbsa → defolt
   `ot.custom(slot)` — sahə admin tərəfindən dəyişdirilibmi (gizlətmə daxil).
   Şablon bunu adların animasiyalı çəkilişini sadə mətnlə əvəz edəndə işlədir.

   ⚠ Override YOXDURSA davranış əvvəlki ilə eynidir: `text()` defoltu verir,
   `mono` avtomatik monoqramdır. */
export function makeOpeningText(templateId, ctx, opening = null) {
  const lang = OPENING_LANGS.includes(ctx.lang) ? ctx.lang : 'az'
  const defaults = openingDefaults(templateId, ctx)
  const texts = (opening && opening.text) || {}
  const hidden = new Set((opening && opening.hide) || [])

  const own = (slot) => {
    const e = texts[slot]
    return (e && (e[lang] || e.az)) || ''
  }

  const m = opening && opening.mono
  let mono
  if (!m || !m.mode || m.mode === 'auto') mono = { kind: 'auto', text: autoMonogram(templateId, ctx) }
  else if (m.mode === 'none') mono = { kind: 'none' }
  else if (m.mode === 'image' && m.image) mono = { kind: 'image', src: m.image }
  else if ((m.mode === 'text' || m.mode === 'sticker') && m.value) mono = { kind: m.mode, text: m.value }
  else mono = { kind: 'auto', text: autoMonogram(templateId, ctx) }

  const text = (slot) => (hidden.has(slot) ? '' : (own(slot) || defaults[slot] || ''))
  return {
    lang,
    defaults,
    mono,
    text,
    hidden: (slot) => hidden.has(slot),
    show: (slot) => !hidden.has(slot),
    custom: (slot) => hidden.has(slot) || !!own(slot),
    /** Sahə dəyişdirilməyibsə `undefined` (şablon öz zəngin markup-ını çəkir),
        dəyişdirilibsə yeni mətn ('' = gizli). */
    override: (slot) => ((hidden.has(slot) || own(slot)) ? text(slot) : undefined),
  }
}
