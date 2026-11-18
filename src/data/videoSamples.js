/* ─────────────────────────────────────────────────────────────────────────────
   VİDEO paketi (29 ₼) — nümunə üslublar (2026-11-18).

   Hər nümunə YouTube Shorts videosudur və saytda YENİDƏN YERLƏŞDİRİLMİR:
   poster i.ytimg.com-dan gəlir, video yalnız «Bax» basılanda
   youtube-nocookie.com iframe-ində açılır (CSP frame-src artıq icazə verir).
   Videolar başqa studiyaların işidir — müştəriyə ÜSLUB nümunəsi kimi göstərilir;
   hazır video müştərinin öz adları və Azərbaycan dilində mətni ilə hazırlanır.

   Yeni nümunə = massivə yeni obyekt. `id` sifariş mesajına və admin-ə gedir,
   ona görə dəyişdirilməməlidir (köhnə sifarişlər onu göstərir).
   ───────────────────────────────────────────────────────────────────────── */

import { youtubePoster } from './packageCopy.js'

export const VIDEO_SAMPLES = [
  {
    id: 'gold-baroque',
    youtubeId: '0Tbh4YeXb0s',
    title: { az: 'Qızılı çərçivə və al güllər', en: 'Gold frame and red roses', ru: 'Золотая рамка и алые розы' },
    note:  { az: 'Klassik, təntənəli toy üçün', en: 'For a classic, festive wedding', ru: 'Для классической торжественной свадьбы' },
  },
  {
    id: 'black-gold',
    youtubeId: 'dEB56U42FJc',
    title: { az: 'Qara və qızılı', en: 'Black and gold', ru: 'Чёрный и золотой' },
    note:  { az: 'Sakit, müasir və dəbdəbəli', en: 'Calm, modern and luxurious', ru: 'Спокойно, современно, роскошно' },
  },
  {
    id: 'pink-magnolia',
    youtubeId: 'ELSPNLLqVn0',
    title: { az: 'Çəhrayı maqnoliya', en: 'Pink magnolia', ru: 'Розовая магнолия' },
    note:  { az: 'Zərif budaqlar, yüngül hərəkət', en: 'Delicate branches, gentle motion', ru: 'Нежные ветви, лёгкое движение' },
  },
  {
    id: 'green-leaves',
    youtubeId: '-vrsWN4cBBc',
    title: { az: 'Yaşıl yarpaqlar', en: 'Green leaves', ru: 'Зелёные листья' },
    note:  { az: 'Minimal və təbii', en: 'Minimal and natural', ru: 'Минимально и естественно' },
  },
  {
    id: 'pastel-flowers',
    youtubeId: '6K9i6vsdI_I',
    title: { az: 'Pastel güllər', en: 'Pastel flowers', ru: 'Пастельные цветы' },
    note:  { az: 'Nişan və kiçik məclis üçün', en: 'For an engagement or a small party', ru: 'Для помолвки и небольшого праздника' },
  },
  {
    id: 'crimson-roses',
    youtubeId: 'xERck0MHV60',
    title: { az: 'Qırmızı-çəhrayı güllər', en: 'Crimson and pink roses', ru: 'Красные и розовые розы' },
    note:  { az: 'Parlaq rənglər, xına gecəsinə uyğun', en: 'Bold colours, suits a henna night', ru: 'Яркие цвета, подходит для хны' },
  },
  {
    id: 'watercolor-couple',
    youtubeId: 'CC6VvVnvZqo',
    title: { az: 'Akvarel cütlük', en: 'Watercolour couple', ru: 'Акварельная пара' },
    note:  { az: 'Çəkilmiş bəy və gəlin obrazı', en: 'Illustrated bride and groom', ru: 'Нарисованные жених и невеста' },
  },
  {
    id: 'photo-oval',
    youtubeId: 'iE_tCjqffPs',
    title: { az: 'Şəkilli dəvət', en: 'Invitation with a photo', ru: 'Приглашение с фото' },
    note:  { az: 'Sizin şəkliniz oval çərçivədə', en: 'Your photo in an oval frame', ru: 'Ваше фото в овальной рамке' },
  },
  {
    id: 'gatsby-night',
    youtubeId: 'eeYq9LUqaH8',
    title: { az: 'Gatsby gecəsi', en: 'Gatsby night', ru: 'Вечер в стиле Гэтсби' },
    note:  { az: 'Qızılı parıltı — ad günü, korporativ', en: 'Gold sparkle — birthday, corporate', ru: 'Золотое сияние — день рождения, корпоратив' },
  },
  {
    id: 'birthday-balloons',
    youtubeId: 'ai0E08nFXTs',
    title: { az: 'Ad günü — şarlar', en: 'Birthday balloons', ru: 'День рождения — шары' },
    note:  { az: 'Yubiley və ad günü üçün', en: 'For a birthday or jubilee', ru: 'Для дня рождения и юбилея' },
  },
]

export const findVideoSample = (id) => VIDEO_SAMPLES.find((s) => s.id === id) || null
export const sampleTitle = (s, lang = 'az') => s.title[lang] || s.title.az

/* Kiçik poster (≈15 KB) — kart üçün kifayətdir; video yalnız «Bax»-da açılır */
export const samplePoster = (s) => youtubePoster(s.youtubeId)
export const sampleWatchUrl = (s) => `https://www.youtube.com/shorts/${s.youtubeId}`
export const sampleEmbedUrl = (s) =>
  `https://www.youtube-nocookie.com/embed/${s.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`

/* Müştərinin öz nümunə linki: yalnız http(s) URL, 500 simvola qədər */
export function normalizeSampleLink(raw) {
  const v = String(raw || '').trim()
  if (!v || v.length > 500) return ''
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return ''
    return u.toString()
  } catch {
    return ''
  }
}

/* Sifarişin nümunə mənbəyi: { sample } · { link } · {} (= WhatsApp-da göndəriləcək) */
export function describeVideoSource(v = {}) {
  if (v.source === 'sample') {
    const sample = findVideoSample(v.sampleId)
    if (sample) return { sample }
  }
  if (v.source === 'link') {
    const link = normalizeSampleLink(v.link)
    if (link) return { link }
  }
  return {}
}

/* Fon musiqisinin yazılışı: «Ad — İfaçı» · öz mahnısı · fallback («Siz seçin») */
export function videoMusicLabel(m = {}, fallback) {
  if (m.mode === 'preset' && m.title) return `${m.title}${m.artist ? ` — ${m.artist}` : ''}`
  if (m.mode === 'own' && (m.custom || '').trim()) return m.custom.trim()
  return fallback
}
