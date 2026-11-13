/* golden-jubilee — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qalan', en: 'Counting down', ru: 'До торжества' } },
  venue:     { title: { az: 'Məclis yeri', en: 'The venue', ru: 'Место торжества' } },
  program:   { title: { az: 'Axşamın səhifələri', en: 'Pages of the evening', ru: 'Страницы вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Sizin masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Ailə albomu', en: 'Family album', ru: 'Семейный альбом' } },
  rsvp:      { title: { az: 'Bizimlə olun', en: 'Be with us', ru: 'Будьте с нами' } },
  guestbook: { title: { az: 'Albom üçün arzular', en: 'Wishes for the album', ru: 'Пожелания в альбом' } },
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
