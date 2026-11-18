/* Builder addım id-ləri: 0 Dizayn, 1 Tədbir, 9 Bölmələr, 10 Bizim Hekayəmiz, 2 Məkan,
   3 Proqram, 4 Geyim, 5 Musiqi, 6 Oturma Planı, 7 Foto Qalereya.

   Hər paket öz kilidlərini daşıyır:
     lockedSteps    — builder-dən çıxan addımlar
     lockedFeatures — addımı olmayan bölmələr ('rsvp', 'guestbook')
     web: false     — veb-dəvətnamə deyil (VIDEO: qısa sifariş forması → WhatsApp)
   Sıra artan qiymətdir; admin adı `packageLabel(id)`-dən gəlir.
   ⚠ PHP tərəfi: public/api/config.php › DIGITOY_PACKAGES ilə EYNİ olmalıdır. */
export const PACKAGE_DEFS = {
  VIDEO:   { id: 'VIDEO',   name: 'Videolu dəvətnamə', price: '29',  lockedSteps: [6, 7, 10], lockedFeatures: ['rsvp', 'guestbook'], popular: false, web: false },
  MINI:    { id: 'MINI',    name: 'Mini',              price: '39',  lockedSteps: [6, 7, 10], lockedFeatures: ['rsvp', 'guestbook'], popular: false, web: true },
  SADE:    { id: 'SADE',    name: 'Sadə',              price: '59',  lockedSteps: [6, 7],     lockedFeatures: ['rsvp'],              popular: false, web: true },
  VIP:     { id: 'VIP',     name: 'VİP',               price: '89',  lockedSteps: [7],        lockedFeatures: [],                    popular: true,  web: true },
  PREMIUM: { id: 'PREMIUM', name: 'Premium',           price: '129', lockedSteps: [],         lockedFeatures: [],                    popular: false, web: true },
}

/* Pricing kartlarında göstərilən veb-paketlər (artan qiymət) */
export const WEB_PACKAGE_IDS = Object.values(PACKAGE_DEFS).filter((d) => d.web).map((d) => d.id)

export const isVideoPackage = (pkgId) => PACKAGE_DEFS[pkgId]?.web === false

/** Admin və WhatsApp sifarişindəki ad: «Sadə (59₼)» */
export const packageLabel = (pkgId) => {
  const d = PACKAGE_DEFS[pkgId]
  return d ? `${d.name} (${d.price}₼)` : (pkgId || '—')
}

/* Phase 18 — dəyər əsaslı mövqeləndirmə: hər paket "VIP-dəkilərin hamısı + ..."
   kumulyativ çərçivəsi ilə təqdim olunur, ayrı-ayrı funksiya siyahısı kimi yox. */
export const PKG_FEATURES = {
  az: {
    MINI: {
      included: ['Açılış animasiyası', 'Geri sayım saatı', 'Google Maps naviqasiya', 'Dress code', 'Toy proqramı', 'Paylaşıla bilən link', '🎵 Dəvətnamənizdəki musiqini şəxsi zövqünüzə uyğun seçin'],
      locked:   ['Bizim Hekayəmiz (Love Story)', 'Təbrik Kitabı', 'İştirak Təsdiqi'],
    },
    SADE: {
      included: ['Mini paketdəki hər şey', 'Bizim Hekayəmiz (Love Story)', 'Təbrik Kitabı — qonaqların arzuları'],
      locked:   ['İştirak Təsdiqi', 'Oturma Planı', 'QR Foto Paylaşım', 'Qalereya idarəetməsi'],
    },
    VIP: {
      included: ['Sadə paketdəki hər şey', 'İştirak Təsdiqi', 'Oturma Planı', 'Qonaq siyahısının idarə olunması'],
      locked:   ['QR Foto Paylaşım', 'Qalereya idarəetməsi'],
    },
    PREMIUM: {
      included: ['VIP paketdəki hər şey', 'QR Foto Paylaşım Sistemi', 'Qonaq Qalereyası', 'Qalereya İdarəetməsi', 'Bütün şəkilləri ZIP endirmə', 'HD çap üçün QR kart faylı', 'Prioritet hazırlama'],
      locked:   [],
    },
    VIDEO: {
      included: ['Nümunəyə uyğun şaquli video (9:16)', 'Adlarınız, tarix, saat və məkan', 'Dəvət mətni sizin istəyinizlə', 'Fon musiqisi seçimi', 'WhatsApp və Instagram üçün hazır MP4'],
      locked:   [],
    },
  },
  en: {
    MINI: {
      included: ['Opening animation', 'Countdown timer', 'Google Maps navigation', 'Dress code', 'Event program', 'Shareable link', '🎵 Choose the music of your invitation to match your taste'],
      locked:   ['Our Story (Love Story)', 'Guestbook', 'RSVP (guest confirmation)'],
    },
    SADE: {
      included: ['Everything in Mini', 'Our Story (Love Story)', 'Guestbook — wishes from your guests'],
      locked:   ['RSVP (guest confirmation)', 'Seating plan', 'QR photo sharing', 'Gallery management'],
    },
    VIP: {
      included: ['Everything in Basic', 'RSVP (guest confirmation)', 'Seating plan', 'Guest list management'],
      locked:   ['QR photo sharing', 'Gallery management'],
    },
    PREMIUM: {
      included: ['Everything in VIP', 'QR photo sharing system', 'Guest gallery', 'Gallery management', 'Download all photos as ZIP', 'HD print-ready QR card file', 'Priority preparation'],
      locked:   [],
    },
    VIDEO: {
      included: ['Vertical video (9:16) in the style you pick', 'Your names, date, time and venue', 'Invitation text the way you want it', 'Background music of your choice', 'Ready MP4 for WhatsApp and Instagram'],
      locked:   [],
    },
  },
  ru: {
    MINI: {
      included: ['Анимация открытия', 'Таймер обратного отсчёта', 'Навигация Google Maps', 'Дресс-код', 'Программа мероприятия', 'Ссылка для отправки', '🎵 Выберите музыку приглашения по своему вкусу'],
      locked:   ['Наша история (Love Story)', 'Книга пожеланий', 'Подтверждение участия'],
    },
    SADE: {
      included: ['Всё из пакета Мини', 'Наша история (Love Story)', 'Книга пожеланий от гостей'],
      locked:   ['Подтверждение участия', 'План рассадки', 'QR обмен фото', 'Управление галереей'],
    },
    VIP: {
      included: ['Всё из пакета Базовый', 'Подтверждение участия', 'План рассадки', 'Управление списком гостей'],
      locked:   ['QR обмен фото', 'Управление галереей'],
    },
    PREMIUM: {
      included: ['Всё из пакета VIP', 'Система QR обмена фото', 'Галерея гостей', 'Управление галереей', 'Скачивание всех фото в ZIP', 'HD файл QR-карты для печати', 'Приоритетная подготовка'],
      locked:   [],
    },
    VIDEO: {
      included: ['Вертикальное видео (9:16) в выбранном стиле', 'Ваши имена, дата, время и место', 'Текст приглашения по вашему желанию', 'Фоновая музыка на выбор', 'Готовый MP4 для WhatsApp и Instagram'],
      locked:   [],
    },
  },
}

export function getLockedSteps(pkgId) {
  return PACKAGE_DEFS[pkgId]?.lockedSteps ?? []
}

/* Paket ID-dən feature gates qaytarır — bütün komponentlər bu funksiyanı istifadə edir.
   ⚠ Boş ID SADE sayılır (köhnə dəvətnamələr); naməlum ID-də heç nə kilidlənmir
   (əvvəlki davranış). */
export function getPackageGates(pkgId) {
  const id       = pkgId || 'SADE'
  const locked   = getLockedSteps(id)
  const features = PACKAGE_DEFS[id]?.lockedFeatures ?? []
  return {
    allowRsvp:      !features.includes('rsvp'),
    allowSeating:   !locked.includes(6),
    allowGallery:   !locked.includes(7),
    allowLoveStory: !locked.includes(10),
    allowGuestbook: !features.includes('guestbook'),
  }
}
