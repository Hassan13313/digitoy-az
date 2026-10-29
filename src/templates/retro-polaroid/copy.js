/* retro-polaroid — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Geri sayım', en: 'Countdown', ru: 'Обратный отсчёт' } },
  venue:     { title: { az: 'Görüşək burada', en: 'Meet us here', ru: 'Встречаемся здесь' } },
  program:   { title: { az: 'Axşamın ritmi', en: 'Rhythm of the night', ru: 'Ритм вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Outfit', ru: 'Наряд' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'Çəkdiyimiz anlar', en: 'Snapshots', ru: 'Снимки' } },
  rsvp:      { title: { az: 'Gəlirsiniz?', en: 'Coming?', ru: 'Придёте?' } },
  guestbook: { title: { az: 'Bir neçə xoş söz', en: 'A few kind words', ru: 'Пара тёплых слов' } },
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
