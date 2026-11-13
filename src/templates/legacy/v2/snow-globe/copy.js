/* snow-globe — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama neçə gün qaldı?', en: 'How long till the holiday?', ru: 'Сколько до праздника?' } },
  venue:     { title: { az: 'Harada görüşürük?', en: 'Where we meet', ru: 'Где встречаемся?' } },
  program:   { title: { az: 'Bayram axşamı', en: 'Holiday evening', ru: 'Праздничный вечер' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin üçün hədiyyə', en: 'A tag for you', ru: 'Ярлычок для вас' } },
  gallery:   { title: { az: 'Qış anları', en: 'Winter moments', ru: 'Зимние моменты' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you join us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Bayram açıqcaları', en: 'Holiday cards', ru: 'Праздничные открытки' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    ny: 'Yeni il',
    to: 'Kimə:',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    ny: 'New Year',
    to: 'To:',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    ny: 'Новый год',
    to: 'Кому:',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['ny', 'hero', 'Dizayn mətni: «Yeni il»'],
  ['to', 'seating', 'Dizayn mətni: «Kimə:»'],
]
