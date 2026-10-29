/* circus-show — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şouya qədər', en: 'Until showtime', ru: 'До начала шоу' } },
  venue:     { title: { az: 'Çadır burada', en: 'Find the big top', ru: 'Где наш шатёр' } },
  program:   { title: { az: 'Şou proqramı', en: 'Tonight’s acts', ru: 'Программа шоу' } },
  dresscode: { title: { az: 'Şou geyimi', en: 'Showtime attire', ru: 'Наряд для шоу' } },
  seating:   { title: { az: 'Arenada yeriniz', en: 'Your seat by the ring', ru: 'Ваше место у арены' } },
  gallery:   { title: { az: 'Afişa divarı', en: 'The poster wall', ru: 'Стена афиш' } },
  rsvp:      { title: { az: 'Şouya gələcəksiniz?', en: 'Coming to the show?', ru: 'Придёте на шоу?' } },
  guestbook: { title: { az: 'Alqışlar', en: 'Applause', ru: 'Аплодисменты' } },
}

export const TXT = {
  az: {
    brand: 'DIGITOY',
    bigShow: 'Böyük şou',
    act: 'Nömrə',
    table: 'Masa',
    bravo: 'Bravo!',
    tonight: 'Yalnız bir gün!',
  },
  en: {
    brand: 'DIGITOY',
    bigShow: 'The big show',
    act: 'Act',
    table: 'Table',
    bravo: 'Bravo!',
    tonight: 'One day only!',
  },
  ru: {
    brand: 'DIGITOY',
    bigShow: 'Большое шоу',
    act: 'Номер',
    table: 'Стол',
    bravo: 'Браво!',
    tonight: 'Только один день!',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['bigShow', 'hero', 'Dizayn mətni: «Böyük şou»'],
  ['act', 'program', 'Dizayn mətni: «Nömrə»'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['bravo', 'guestbook', 'Dizayn mətni: «Bravo!»'],
  ['tonight', 'hero', 'Dizayn mətni: «Yalnız bir gün!»'],
]
