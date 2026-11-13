/* love-letters — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Görüşə qədər', en: 'Until we meet', ru: 'До встречи' } },
  venue:     { title: { az: 'Ünvan', en: 'The address', ru: 'Адрес' } },
  program:   { title: { az: 'Axşamın sətirləri', en: 'Lines of the evening', ru: 'Строки вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Sizə ünvanlı', en: 'Addressed to you', ru: 'Адресовано вам' } },
  gallery:   { title: { az: 'Məktublar arasında', en: 'Between the letters', ru: 'Между письмами' } },
  rsvp:      { title: { az: 'Cavab məktubu', en: 'Your reply', ru: 'Ответное письмо' } },
  guestbook: { title: { az: 'Bizə bir məktub', en: 'Write us a letter', ru: 'Напишите нам письмо' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    to: 'Kimə:',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    to: 'To:',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    to: 'Кому:',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['to', 'seating', 'Dizayn mətni: «Kimə:»'],
]
