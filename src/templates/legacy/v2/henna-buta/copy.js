/* henna-buta — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Xına yaxılana qədər', en: 'Until the henna is applied', ru: 'До нанесения хны' } },
  venue:     { title: { az: 'Gecənin məkanı', en: 'The venue', ru: 'Место вечера' } },
  program:   { title: { az: 'Gecənin naxışı', en: 'The pattern of the night', ru: 'Узор вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'What to wear', ru: 'Что надеть' } },
  seating:   { title: { az: 'Yerinizi tapın', en: 'Find your seat', ru: 'Найдите своё место' } },
  gallery:   { title: { az: 'Naxışlı anlar', en: 'Patterned moments', ru: 'Узорные моменты' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Gəlinin ovucuna bir arzu', en: 'A wish in the bride’s palm', ru: 'Пожелание на ладони невесты' } },
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
