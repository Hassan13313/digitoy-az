/* ─────────────────────────────────────────────────────────────────────────────
   VİDEO paketi (29 ₼) — nümunə üslublar (2026-11-18).

   Videolar DigiToy-un ÖZ işidir: fon şəkilləri ChatGPT-də (sahibin hesabında)
   yaradılıb, yazılar və hərəkət lokal render olunub (ffmpeg) — public/video/samples/.
   Hər nümunə: <id>.mp4 (720×1280, ~1 MB, səssiz) + <id>.webp poster (360×640).

   Yeni nümunə = massivə yeni obyekt + iki fayl. `id` sifariş mesajına və admin-ə
   gedir, ona görə dəyişdirilməməlidir (köhnə sifarişlər onu göstərir).
   ───────────────────────────────────────────────────────────────────────── */

const S = (id, az, en, ru, nAz, nEn, nRu) => ({
  id,
  title: { az, en, ru },
  note: { az: nAz, en: nEn, ru: nRu },
})

export const VIDEO_SAMPLES = [
  S('ivory-arch', 'Fil sümüyü tağ və orxideyalar', 'Ivory arch and orchids', 'Арка цвета слоновой кости и орхидеи',
    'Klassik, zərif toy', 'A classic, elegant wedding', 'Классическая, изящная свадьба'),
  S('royal-burgundy', 'Bordo məxmər və qızılı çərçivə', 'Burgundy velvet and gold frame', 'Бордовый бархат и золотая рама',
    'Təntənəli, saray üslubu', 'Grand, palace style', 'Торжественно, дворцовый стиль'),
  S('midnight-sky', 'Gecə səması və hilal', 'Night sky and crescent moon', 'Ночное небо и полумесяц',
    'Nişan və axşam məclisi', 'Engagement or evening party', 'Помолвка и вечерний праздник'),
  S('garden-arch', 'Yaşıl bağ tağı', 'Green garden arch', 'Зелёная садовая арка',
    'Təbii, işıqlı və təravətli', 'Natural, bright and fresh', 'Естественно, светло и свежо'),
  S('black-gold', 'Qara və qızılı', 'Black and gold', 'Чёрный и золотой',
    'Dəbdəbəli gecə toyu', 'A glamorous evening wedding', 'Роскошная вечерняя свадьба'),
  S('blush-peony', 'Çəhrayı pionlar', 'Blush peonies', 'Нежные пионы',
    'Yumşaq, romantik nişan', 'A soft, romantic engagement', 'Нежная, романтичная помолвка'),
  S('xina-night', 'Xına gecəsi — al və qızılı', 'Henna night — red and gold', 'Вечер хны — красный и золотой',
    'Şamlar, buta naxışları', 'Candles and buta patterns', 'Свечи и узоры бута'),
  S('crystal-ballroom', 'Kristal saray zalı', 'Crystal ballroom', 'Хрустальный бальный зал',
    'Çilçıraqlar və mərmər', 'Chandeliers and marble', 'Люстры и мрамор'),
  S('baku-night', 'Bakı gecəsi', 'Baku at night', 'Ночной Баку',
    'Şəhər işıqları, qızılı tonlar', 'City lights in golden tones', 'Огни города в золотых тонах'),
  S('birthday-gold', 'Ad günü — qızılı şarlar', 'Birthday — gold balloons', 'День рождения — золотые шары',
    'Ad günü və yubiley', 'Birthday or jubilee', 'День рождения и юбилей'),
]

export const findVideoSample = (id) => VIDEO_SAMPLES.find((s) => s.id === id) || null
export const sampleTitle = (s, lang = 'az') => s.title[lang] || s.title.az

/* Fayllar 1 il keşlənir (.htaccess) — videonu yenidən render edəndə V-ni artırın */
const V = '1'
export const sampleVideo = (s) => `/video/samples/${s.id}.mp4?v=${V}`
export const samplePoster = (s) => `/video/samples/${s.id}.webp?v=${V}`
/* Admin-ə gedən WhatsApp mesajı üçün tam ünvan */
export const sampleWatchUrl = (s) => `https://digitoy.az${sampleVideo(s)}`

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
