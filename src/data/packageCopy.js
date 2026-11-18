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
  az: { title: 'Paketinizi Seçin', subtitle: 'Hər paket hazır, zərif və tam işlək dəvətnamədir — sizə lazım olanı seçin. Ödəniş son variant sizinlə təsdiqləndikdən sonra edilir.', popular: '★ ƏN ÇOX SEÇİLƏN', btn: 'SEÇİM ET', pricing: 'PRICING' },
  en: { title: 'Choose Your Package', subtitle: 'Every package is a ready, elegant, fully working invitation — pick what you need. You pay once the final version is approved with you.', popular: '★ MOST POPULAR', btn: 'GET STARTED', pricing: 'PRICING' },
  ru: { title: 'Выберите пакет', subtitle: 'Каждый пакет — готовое, элегантное и полностью рабочее приглашение. Оплата — после того как финальный вариант согласован с вами.', popular: '★ САМЫЙ ПОПУЛЯРНЫЙ', btn: 'НАЧАТЬ', pricing: 'PRICING' },
}

export const PKG_SUBTITLES = {
  az: {
    MINI:    'Bütün vacib məlumatlar bir zərif linkdə — çap və paylama xərci olmadan.',
    SADE:    'Sevgi hekayəniz və qonaqların arzuları — illərlə xatırlanacaq dəvətnamə.',
    VIP:     'Kimin gələcəyini əvvəlcədən bilin — qonaq sayını və masaları rahat planlayın.',
    PREMIUM: 'Toy gününüzün hər anı — qonaqların çəkdiyi bütün şəkil və videolar bir albomda.',
    VIDEO:   'İstədiyiniz nümunədə videolu dəvətnamə — WhatsApp və Instagram-da paylaşmaq üçün.',
  },
  en: {
    MINI:    'Every key detail in one elegant link — no printing, no delivery costs.',
    SADE:    'Your love story and your guests’ wishes — an invitation remembered for years.',
    VIP:     'Know who is coming in advance — plan guest numbers and tables with ease.',
    PREMIUM: 'Every moment of your day — all your guests’ photos and videos in one album.',
    VIDEO:   'A video invitation in the style you want — made for sharing on WhatsApp and Instagram.',
  },
  ru: {
    MINI:    'Вся важная информация в одной элегантной ссылке — без печати и доставки.',
    SADE:    'Ваша история любви и пожелания гостей — приглашение, которое помнят годами.',
    VIP:     'Узнайте заранее, кто придёт, — спокойно планируйте число гостей и столы.',
    PREMIUM: 'Каждый момент вашего дня — все фото и видео гостей в одном альбоме.',
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

/* Video kartındakı 3 poster = data/videoSamples.js-in İLK 3 nümunəsi (test yoxlayır).
   Burada yalnız id-lər var: bu fayl ana bundle-dadır, nümunə siyahısı isə video
   formasının lazy chunk-ında qalsın. */
export const CARD_SAMPLE_IDS = ['ivory-arch', 'royal-burgundy', 'midnight-sky']

/* Kartdakı funksiya qruplarının başlıqları (üstünlüklər ulduzla, başlıqsız gəlir) */
const GROUP_LABELS = {
  az: { yes: 'Həmçinin daxildir', no: 'Daxil deyil' },
  en: { yes: 'Also included', no: 'Not included' },
  ru: { yes: 'Также входит', no: 'Не входит' },
}

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
      ...feats[id].highlights.map((f) => ['star', f]),
      ...feats[id].base.map((f) => ['yes', f]),
      ...feats[id].locked.map((f) => ['no', f]),
    ],
    groupLabels: GROUP_LABELS[lang] || GROUP_LABELS.az,
    badge: def.popular ? ui.popular.replace(/^★\s*/, '') : premium ? badges.PREMIUM : undefined,
    featured: premium,
  }
}

/* Yeni Pricing komponentinin formatı:
   { id, name, price, tagline, features: [[status, label]], groupLabels, badge?, featured? }
   status: 'star' bu paketin üstünlüyü · 'yes' həmçinin daxildir · 'no' daxil deyil
   Yalnız veb-paketlər (artan qiymət): MINI · SADE · VIP · PREMIUM */
export function buildPricingPackages(lang = 'az') {
  return WEB_PACKAGE_IDS.map((id) => buildCard(id, lang))
}

/* VIDEO paketi — veb-paketlərdən ayrı, enli kart kimi göstərilir */
export function buildVideoPackage(lang = 'az') {
  return { ...buildCard('VIDEO', lang), ...(VIDEO_CARD_COPY[lang] || VIDEO_CARD_COPY.az), posters: CARD_SAMPLE_IDS.map((id) => `/video/samples/${id}.webp?v=1`) }
}
