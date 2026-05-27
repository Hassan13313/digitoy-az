export const PACKAGE_DEFS = {
  SADE: { id: 'SADE', price: '59', lockedSteps: [5, 6], popular: false },
  VIP:  { id: 'VIP',  price: '89', lockedSteps: [6],    popular: true  },
  PREMIUM: { id: 'PREMIUM', price: '129', lockedSteps: [], popular: false },
}

export const PKG_FEATURES = {
  az: {
    SADE:    {
      included: ['Geri sayım saatı', 'Google Maps naviqasiya', 'Dress code bölməsi', 'Toy proqramı', 'Paylaşıla bilən link', '6 ay aktivlik'],
      locked:   ['Oturma planı', 'Foto paylaşım QR'],
    },
    VIP: {
      included: ['Geri sayım saatı', 'Google Maps naviqasiya', 'Dress code bölməsi', 'Toy proqramı', 'Oturma planı', 'Paylaşıla bilən link', '1 il aktivlik'],
      locked:   ['Foto paylaşım QR'],
    },
    PREMIUM: {
      included: ['Geri sayım saatı', 'Google Maps naviqasiya', 'Dress code bölməsi', 'Toy proqramı', 'Oturma planı', 'Foto paylaşım QR', 'Paylaşıla bilən link', 'Limitsiz aktivlik'],
      locked:   [],
    },
  },
  en: {
    SADE:    {
      included: ['Countdown timer', 'Google Maps navigation', 'Dress code section', 'Event program', 'Shareable link', '6 months active'],
      locked:   ['Seating plan', 'Photo share QR'],
    },
    VIP: {
      included: ['Countdown timer', 'Google Maps navigation', 'Dress code section', 'Event program', 'Seating plan', 'Shareable link', '1 year active'],
      locked:   ['Photo share QR'],
    },
    PREMIUM: {
      included: ['Countdown timer', 'Google Maps navigation', 'Dress code section', 'Event program', 'Seating plan', 'Photo share QR', 'Shareable link', 'Unlimited active'],
      locked:   [],
    },
  },
  ru: {
    SADE:    {
      included: ['Таймер обратного отсчёта', 'Навигация Google Maps', 'Раздел дресс-кода', 'Программа мероприятия', 'Ссылка для отправки', 'Активность 6 месяцев'],
      locked:   ['План рассадки', 'QR-код для фото'],
    },
    VIP: {
      included: ['Таймер обратного отсчёта', 'Навигация Google Maps', 'Раздел дресс-кода', 'Программа мероприятия', 'План рассадки', 'Ссылка для отправки', 'Активность 1 год'],
      locked:   ['QR-код для фото'],
    },
    PREMIUM: {
      included: ['Таймер обратного отсчёта', 'Навигация Google Maps', 'Раздел дресс-кода', 'Программа мероприятия', 'План рассадки', 'QR-код для фото', 'Ссылка для отправки', 'Безлимитная активность'],
      locked:   [],
    },
  },
}

export function getLockedSteps(pkgId) {
  return PACKAGE_DEFS[pkgId]?.lockedSteps ?? []
}

/* Paket ID-dən feature gates qaytarır — bütün komponentlər bu funksiyanı istifadə edir */
export function getPackageGates(pkgId) {
  const locked = getLockedSteps(pkgId || 'SADE')
  return {
    allowSeating: !locked.includes(5),
    allowGallery: !locked.includes(6),
  }
}
