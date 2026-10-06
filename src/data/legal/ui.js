/* ══════════════════════════════════════════════════════════════════════════
   Phase 47 — hüquqi qatın qısa UI mətnləri (banner, footer, sifariş qeydi, 404).
   Əsas bundle-dadır, ona görə yalnız hər səhifədə lazım olanlar buradadır;
   hüquqi səhifənin öz sətirləri page.js-dədir (lazy chunk).
   translations.js-ə yazılmır (fayl artıq 750+ sətirdir). Açarlar 3 dildə eyni
   olmalıdır (tests/legal_content_test.mjs).
   ══════════════════════════════════════════════════════════════════════ */

import { SOCIAL_LINKS, WHATSAPP_NUMBER, CONTACT_EMAIL } from '../constants.js'

export const LEGAL_UI = {
  az: {
    links: { privacy: 'Məxfilik siyasəti', terms: 'İstifadə şərtləri', refund: 'Ödəniş və geri qaytarma', cookies: 'Kuki ayarları' },
    consent: {
      title: 'Kukilər',
      text: 'Saytı yaxşılaşdırmaq üçün ziyarət statistikası (Google Analytics, PostHog) toplamaq istəyirik. Razılıq versəniz analitika kukiləri qurulur. Saytın işləməsi üçün zəruri olanlar onsuz da işləyir.',
      accept: 'Qəbul et',
      decline: 'İmtina et',
      more: 'Ətraflı',
    },
    orderNote: { pre: 'Sifariş verməklə ', terms: 'İstifadə şərtlərini', mid: ' və ', privacy: 'Məxfilik siyasətini', post: ' qəbul edirəm' },
    notFound: {
      title: 'Bu səhifə tapılmadı.',
      text: 'Link köhnəlmiş və ya yanlış yazılmış ola bilər.',
      home: 'Ana səhifəyə qayıt',
    },
  },
  en: {
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service', refund: 'Payment & Refunds', cookies: 'Cookie settings' },
    consent: {
      title: 'Cookies',
      text: 'We would like to collect visit statistics (Google Analytics, PostHog) to improve the site. If you agree, analytics cookies will be set. Cookies that the site needs to work are used either way.',
      accept: 'Accept',
      decline: 'Decline',
      more: 'Learn more',
    },
    orderNote: { pre: 'By placing an order I accept the ', terms: 'Terms of Service', mid: ' and the ', privacy: 'Privacy Policy', post: '' },
    notFound: {
      title: 'This page was not found.',
      text: 'The link may be outdated or mistyped.',
      home: 'Back to home',
    },
  },
  ru: {
    links: { privacy: 'Политика конфиденциальности', terms: 'Условия использования', refund: 'Оплата и возврат', cookies: 'Настройки cookie' },
    consent: {
      title: 'Файлы cookie',
      text: 'Мы хотели бы собирать статистику посещений (Google Analytics, PostHog), чтобы улучшать сайт. Если вы согласны, будут установлены аналитические cookie. Файлы, необходимые для работы сайта, используются в любом случае.',
      accept: 'Принять',
      decline: 'Отказаться',
      more: 'Подробнее',
    },
    orderNote: { pre: 'Оформляя заказ, я принимаю ', terms: 'Условия использования', mid: ' и ', privacy: 'Политику конфиденциальности', post: '' },
    notFound: {
      title: 'Страница не найдена.',
      text: 'Ссылка могла устареть или содержать опечатку.',
      home: 'На главную',
    },
  },
}

export const legalUi = (lang) => LEGAL_UI[lang] || LEGAL_UI.az

/* Hüquqi mətnlərdə və səhifələrdə göstərilən əlaqə (data/constants.js-dən) */
const wa = WHATSAPP_NUMBER   /* 994992133696 → +994 99 213 36 96 */
export const LEGAL_CONTACT = {
  brand: 'Digitoy.az',
  email: CONTACT_EMAIL,
  phone: `+${wa.slice(0, 3)} ${wa.slice(3, 5)} ${wa.slice(5, 8)} ${wa.slice(8, 10)} ${wa.slice(10)}`,
  whatsapp: SOCIAL_LINKS.whatsapp,
}

/* Krem fonda link rəngi — tünd qızılı, 6:1 kontrast (adi qızılı #C5A059 2.4:1 verir) */
export const LEGAL_LINK = '#7D5B1F'
