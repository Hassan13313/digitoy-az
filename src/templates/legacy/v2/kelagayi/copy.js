/* kelagayi — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecəyə qalan vaxt', en: 'Time until the night', ru: 'До вечера осталось' } },
  venue:     { title: { az: 'Ünvan', en: 'The address', ru: 'Адрес' } },
  program:   { title: { az: 'Gecənin naxışı', en: 'The evening’s pattern', ru: 'Узор вечера' } },
  dresscode: { title: { az: 'Libas', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'İpək kimi anlar', en: 'Silken moments', ru: 'Шёлковые мгновения' } },
  rsvp:      { title: { az: 'Cavabınızı gözləyirik', en: 'We await your reply', ru: 'Ждём вашего ответа' } },
  guestbook: { title: { az: 'Kəlağayıya düyün — bir arzu', en: 'Tie a wish to the scarf', ru: 'Завяжите желание на платке' } },
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
