import { PACKAGE_DEFS, PKG_FEATURES } from './packages.js'
import { getPartner } from './partners.js'

/* ─────────────────────────────────────────────────────────────────────────────
   Paket kartlarının mətnləri (3 dil) — köhnə PackageSelect və yeni Pricing
   (UI redesign 2026-10) EYNİ mənbədən oxuyur. Qiymət və funksiya siyahısı
   packages.js-dədir, tərəfdaş endirimi partners.js-də.
   ───────────────────────────────────────────────────────────────────────── */

export const PKG_LABELS = {
  az: { SADE: 'SADƏ', VIP: 'VİP', PREMIUM: 'PREMIUM' },
  en: { SADE: 'BASIC', VIP: 'VIP', PREMIUM: 'PREMIUM' },
  ru: { SADE: 'БАЗОВЫЙ', VIP: 'VIP', PREMIUM: 'ПРЕМИУМ' },
}

export const UI = {
  az: { title: 'Paketinizi Seçin', subtitle: 'Toyunuza ən uyğun paketi seçin — dəyər zərif detallarda yaşayır.', popular: '★ ƏN ÇOX SEÇİLƏN', btn: 'SEÇİM ET', pricing: 'PRICING' },
  en: { title: 'Choose Your Package', subtitle: 'Select the best package for your event.', popular: '★ MOST POPULAR', btn: 'GET STARTED', pricing: 'PRICING' },
  ru: { title: 'Выберите пакет', subtitle: 'Выберите лучший пакет для вашего мероприятия.', popular: '★ САМЫЙ ПОПУЛЯРНЫЙ', btn: 'НАЧАТЬ', pricing: 'PRICING' },
}

export const PKG_SUBTITLES = {
  az: {
    SADE:    'Toyunuz üçün zərif və premium rəqəmsal dəvətnamə.',
    VIP:     'Qonaqların iştirakını və oturma planını rahat idarə edin.',
    PREMIUM: 'Toy gününüzün bütün xatirələrini bir yerdə toplayın.',
  },
  en: {
    SADE:    'An elegant, premium digital invitation for your wedding.',
    VIP:     'Manage guest attendance and seating with ease.',
    PREMIUM: 'Bring every memory of your wedding day together in one place.',
  },
  ru: {
    SADE:    'Элегантное премиальное цифровое приглашение для вашей свадьбы.',
    VIP:     'Удобно управляйте подтверждением гостей и планом рассадки.',
    PREMIUM: 'Соберите все воспоминания свадебного дня в одном месте.',
  },
}

export const VAGZALI_LINE = {
  az: (pct) => `Vagzali.az-da gəlinlik və digər xidmətlər üçün ${pct}-dək xüsusi endirim`,
  en: (pct) => `Up to ${pct} special discount on bridal and other services at Vagzali.az`,
  ru: (pct) => `Специальная скидка до ${pct} на свадебные платья и другие услуги на Vagzali.az`,
}

export const VAGZALI_NOTE = {
  az: 'Digitoy müştəriləri Vagzali.az tərəfdaş üstünlüklərindən yararlana bilərlər.',
  en: 'Digitoy customers can enjoy Vagzali.az partner benefits.',
  ru: 'Клиенты Digitoy могут воспользоваться партнёрскими преимуществами Vagzali.az.',
}

export const PKG_BADGES = {
  az: { PREMIUM: 'ƏN TAM PAKET' },
  en: { PREMIUM: 'THE COMPLETE PACKAGE' },
  ru: { PREMIUM: 'ПОЛНЫЙ ПАКЕТ' },
}

/* QR Foto Paylaşım + Qalereya — Premium-un əsas fərqləndiricisi.
   Bu açar sözləri ehtiva edən sətirlər kartda vurğulanır (3 dildə). */
export const isDifferentiator = (text) => /qr|qalereya|gallery|галере|zip/i.test(text)

/* Yeni Pricing komponentinin formatı:
   { id, name, price, tagline, features: [[status, label]], gift, badge?, featured? }
   status: 'yes' daxildir · 'no' daxil deyil · 'star' Premium-a xas fərqləndirici */
export function buildPricingPackages(lang = 'az') {
  const labels = PKG_LABELS[lang] || PKG_LABELS.az
  const feats = PKG_FEATURES[lang] || PKG_FEATURES.az
  const subtitles = PKG_SUBTITLES[lang] || PKG_SUBTITLES.az
  const badges = PKG_BADGES[lang] || PKG_BADGES.az
  const ui = UI[lang] || UI.az
  const gift = VAGZALI_LINE[lang] || VAGZALI_LINE.az
  const discounts = getPartner('vagzali').discounts
  return ['SADE', 'VIP', 'PREMIUM'].map((id) => {
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
      gift: gift(discounts[id]),
      badge: def.popular ? ui.popular.replace(/^★\s*/, '') : premium ? badges.PREMIUM : undefined,
      featured: premium,
    }
  })
}
