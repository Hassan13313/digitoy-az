/* baby-mobile — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şirin gözləyiş', en: 'Sweet anticipation', ru: 'Сладкое ожидание' } },
  venue:     { title: { az: 'Harada görüşürük?', en: 'Where we meet', ru: 'Где встречаемся?' } },
  program:   { title: { az: 'Günün laylası', en: 'The day’s lullaby', ru: 'Колыбельная дня' } },
  dresscode: { title: { az: 'Geyim', en: 'What to wear', ru: 'Что надеть' } },
  seating:   { title: { az: 'Ulduzunuz', en: 'Your star', ru: 'Ваша звезда' } },
  gallery:   { title: { az: 'Yumşaq anlar', en: 'Soft moments', ru: 'Нежные моменты' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Laylalar və arzular', en: 'Lullabies and wishes', ru: 'Колыбельные и пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
]
