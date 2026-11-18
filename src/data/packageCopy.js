import { PACKAGE_DEFS, PKG_FEATURES, WEB_PACKAGE_IDS } from './packages.js'

/* ─────────────────────────────────────────────────────────────────────────────
   Paket kartlarının mətnləri (3 dil) — köhnə PackageSelect və yeni Pricing
   (UI redesign 2026-10) EYNİ mənbədən oxuyur. Qiymət və funksiya siyahısı
   packages.js-dədir.

   VIDEO veb-paketlərdən ayrı, enli kart kimi göstərilir (buildVideoPackage).
   ───────────────────────────────────────────────────────────────────────── */

export const PKG_LABELS = {
  az: { VIDEO: 'VİDEO', MINI: 'MİNİ', SADE: 'SADƏ', VIP: 'VİP', PREMIUM: 'PREMIUM' },
  en: { VIDEO: 'VIDEO', MINI: 'MINI', SADE: 'BASIC', VIP: 'VIP', PREMIUM: 'PREMIUM' },
  ru: { VIDEO: 'ВИДЕО', MINI: 'МИНИ', SADE: 'БАЗОВЫЙ', VIP: 'VIP', PREMIUM: 'ПРЕМИУМ' },
}

export const UI = {
  az: { title: 'Paketinizi Seçin', subtitle: 'Toyunuza ən uyğun paketi seçin — dəyər zərif detallarda yaşayır.', popular: '★ ƏN ÇOX SEÇİLƏN', btn: 'SEÇİM ET', pricing: 'PRICING' },
  en: { title: 'Choose Your Package', subtitle: 'Select the best package for your event.', popular: '★ MOST POPULAR', btn: 'GET STARTED', pricing: 'PRICING' },
  ru: { title: 'Выберите пакет', subtitle: 'Выберите лучший пакет для вашего мероприятия.', popular: '★ САМЫЙ ПОПУЛЯРНЫЙ', btn: 'НАЧАТЬ', pricing: 'PRICING' },
}

export const PKG_SUBTITLES = {
  az: {
    MINI:    'Tədbirinizin bütün məlumatları bir zərif linkdə.',
    SADE:    'Toyunuz üçün zərif və premium rəqəmsal dəvətnamə.',
    VIP:     'Qonaqların iştirakını və oturma planını rahat idarə edin.',
    PREMIUM: 'Toy gününüzün bütün xatirələrini bir yerdə toplayın.',
    VIDEO:   'İstədiyiniz nümunədə videolu dəvətnamə — WhatsApp və Instagram-da paylaşmaq üçün.',
  },
  en: {
    MINI:    'All the details of your event in one elegant link.',
    SADE:    'An elegant, premium digital invitation for your wedding.',
    VIP:     'Manage guest attendance and seating with ease.',
    PREMIUM: 'Bring every memory of your wedding day together in one place.',
    VIDEO:   'A video invitation in the style you want — made for sharing on WhatsApp and Instagram.',
  },
  ru: {
    MINI:    'Вся информация о вашем событии в одной элегантной ссылке.',
    SADE:    'Элегантное премиальное цифровое приглашение для вашей свадьбы.',
    VIP:     'Удобно управляйте подтверждением гостей и планом рассадки.',
    PREMIUM: 'Соберите все воспоминания свадебного дня в одном месте.',
    VIDEO:   'Видеоприглашение в нужном вам стиле — для отправки в WhatsApp и Instagram.',
  },
}

export const PKG_BADGES = {
  az: { PREMIUM: 'ƏN TAM PAKET' },
  en: { PREMIUM: 'THE COMPLETE PACKAGE' },
  ru: { PREMIUM: 'ПОЛНЫЙ ПАКЕТ' },
}

/* Videolu dəvətnamə kartının (Pricing › VideoPackageCard) və seçiləndən sonrakı
   bölmə başlığının (LandingPage) mətnləri — ana bundle-da qalan YEGANƏ video mətnləri */
const VIDEO_CARD_COPY = {
  az: { eyebrow: 'Videolu dəvətnamə', ready: '2–3 saat ərzində hazır', note: 'Veb-dəvətnamə deyil — hazır video faylı WhatsApp-da sizə göndərilir.',
        heading: 'Videolu dəvətnamə', headingSub: 'Üç addımda məlumatları göndərin — videonuz 2–3 saat ərzində hazır olur.' },
  en: { eyebrow: 'Video invitation', ready: 'Ready within 2–3 hours', note: 'Not a web invitation — the finished video file is sent to you on WhatsApp.',
        heading: 'Video invitation', headingSub: 'Send us the details in three steps — your video is ready within 2–3 hours.' },
  ru: { eyebrow: 'Видеоприглашение', ready: 'Готово за 2–3 часа', note: 'Это не веб-приглашение — готовый видеофайл мы отправим вам в WhatsApp.',
        heading: 'Видеоприглашение', headingSub: 'Отправьте данные в три шага — видео будет готово за 2–3 часа.' },
}

/* YouTube Shorts posteri (≈15 KB). Video kartındakı 3 poster = data/videoSamples.js-in
   İLK 3 nümunəsi (test yoxlayır). Burada yalnız id-lər var: bu fayl ana bundle-dadır,
   nümunə siyahısı isə video formasının lazy chunk-ında qalsın. */
export const youtubePoster = (youtubeId) => `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
export const CARD_POSTER_IDS = ['0Tbh4YeXb0s', 'dEB56U42FJc', 'ELSPNLLqVn0']

/* QR Foto Paylaşım + Qalereya — Premium-un əsas fərqləndiricisi.
   Bu açar sözləri ehtiva edən sətirlər kartda vurğulanır (3 dildə). */
export const isDifferentiator = (text) => /qr|qalereya|gallery|галере|zip/i.test(text)

function buildCard(id, lang) {
  const labels = PKG_LABELS[lang] || PKG_LABELS.az
  const feats = PKG_FEATURES[lang] || PKG_FEATURES.az
  const subtitles = PKG_SUBTITLES[lang] || PKG_SUBTITLES.az
  const badges = PKG_BADGES[lang] || PKG_BADGES.az
  const ui = UI[lang] || UI.az
  const def = PACKAGE_DEFS[id]
  const premium = id === 'PREMIUM'
  return {
    id,
    name: labels[id],
    price: def.price,
    tagline: subtitles[id],
    features: [
      ...feats[id].included.map((f) => [premium && isDifferentiator(f) ? 'star' : 'yes', f]),
      ...feats[id].locked.map((f) => ['no', f]),
    ],
    badge: def.popular ? ui.popular.replace(/^★\s*/, '') : premium ? badges.PREMIUM : undefined,
    featured: premium,
  }
}

/* Yeni Pricing komponentinin formatı:
   { id, name, price, tagline, features: [[status, label]], badge?, featured? }
   status: 'yes' daxildir · 'no' daxil deyil · 'star' Premium-a xas fərqləndirici
   Yalnız veb-paketlər (artan qiymət): MINI · SADE · VIP · PREMIUM */
export function buildPricingPackages(lang = 'az') {
  return WEB_PACKAGE_IDS.map((id) => buildCard(id, lang))
}

/* VIDEO paketi — veb-paketlərdən ayrı, enli kart kimi göstərilir */
export function buildVideoPackage(lang = 'az') {
  return { ...buildCard('VIDEO', lang), ...(VIDEO_CARD_COPY[lang] || VIDEO_CARD_COPY.az), posters: CARD_POSTER_IDS.map(youtubePoster) }
}
