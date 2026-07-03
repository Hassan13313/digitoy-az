export const PACKAGE_DEFS = {
  SADE: { id: 'SADE', price: '59', lockedSteps: [5, 6], popular: false },
  VIP:  { id: 'VIP',  price: '89', lockedSteps: [6],    popular: true  },
  PREMIUM: { id: 'PREMIUM', price: '129', lockedSteps: [], popular: false },
}

/* Phase 25.1 — Vagzali.az tərəfdaş endirimi (yalnız sifariş axınında göstərilir,
   dəvətnamənin özündə heç vaxt görünmür). */
export const VAGZALI_DISCOUNTS = { SADE: '5%', VIP: '10%', PREMIUM: '15%' }

/* Phase 18 — dəyər əsaslı mövqeləndirmə: hər paket "VIP-dəkilərin hamısı + ..."
   kumulyativ çərçivəsi ilə təqdim olunur, ayrı-ayrı funksiya siyahısı kimi yox. */
export const PKG_FEATURES = {
  az: {
    SADE: {
      included: ['Açılış animasiyası', 'Geri sayım saatı', 'Google Maps naviqasiya', 'Dress code', 'Toy proqramı', 'Paylaşıla bilən link'],
      locked:   ['İştirak Təsdiqi (RSVP)', 'Oturma Planı', 'QR Foto Paylaşım', 'Qalereya idarəetməsi'],
    },
    VIP: {
      included: ['Sadə paketdəki hər şey', 'İştirak Təsdiqi (RSVP)', 'Oturma Planı', 'Qonaq siyahısının idarə olunması'],
      locked:   ['QR Foto Paylaşım', 'Qalereya idarəetməsi'],
    },
    PREMIUM: {
      included: ['VIP paketdəki hər şey', 'QR Foto Paylaşım Sistemi', 'Qonaq Qalereyası', 'Qalereya İdarəetməsi', 'Bütün şəkilləri ZIP endirmə', 'HD çap üçün QR kart faylı', 'Prioritet hazırlama'],
      locked:   [],
    },
  },
  en: {
    SADE: {
      included: ['Opening animation', 'Countdown timer', 'Google Maps navigation', 'Dress code', 'Event program', 'Shareable link'],
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
  },
  ru: {
    SADE: {
      included: ['Анимация открытия', 'Таймер обратного отсчёта', 'Навигация Google Maps', 'Дресс-код', 'Программа мероприятия', 'Ссылка для отправки'],
      locked:   ['Подтверждение участия (RSVP)', 'План рассадки', 'QR обмен фото', 'Управление галереей'],
    },
    VIP: {
      included: ['Всё из пакета Базовый', 'Подтверждение участия (RSVP)', 'План рассадки', 'Управление списком гостей'],
      locked:   ['QR обмен фото', 'Управление галереей'],
    },
    PREMIUM: {
      included: ['Всё из пакета VIP', 'Система QR обмена фото', 'Галерея гостей', 'Управление галереей', 'Скачивание всех фото в ZIP', 'HD файл QR-карты для печати', 'Приоритетная подготовка'],
      locked:   [],
    },
  },
}

export function getLockedSteps(pkgId) {
  return PACKAGE_DEFS[pkgId]?.lockedSteps ?? []
}

/* Paket ID-dən feature gates qaytarır — bütün komponentlər bu funksiyanı istifadə edir.
   RSVP builder addımı kimi mövcud olmadığı üçün (avtomatik render olunur),
   onun gate-i birbaşa paket ID-sindən təyin olunur: yalnız SADE-də bağlıdır. */
export function getPackageGates(pkgId) {
  const id     = pkgId || 'SADE'
  const locked = getLockedSteps(id)
  return {
    allowRsvp:    id !== 'SADE',
    allowSeating: !locked.includes(5),
    allowGallery: !locked.includes(6),
  }
}
