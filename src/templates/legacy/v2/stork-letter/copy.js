/* stork-letter — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Leylək yoldadır', en: 'The stork is on its way', ru: 'Аист уже в пути' } },
  venue:     { title: { az: 'Ünvan', en: 'The address', ru: 'Адрес' } },
  program:   { title: { az: 'Məktubda yazılanlar', en: 'As the letter says', ru: 'Как сказано в письме' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Poçt kartları', en: 'Postcards', ru: 'Открытки' } },
  rsvp:      { title: { az: 'Cavab məktubu', en: 'Your reply', ru: 'Ответное письмо' } },
  guestbook: { title: { az: 'Körpəyə məktublar', en: 'Letters to the baby', ru: 'Письма малышу' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    post: 'Bakı',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    post: 'Baku',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    post: 'Баку',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['post', 'hero', 'Dizayn mətni: «Bakı»'],
]
