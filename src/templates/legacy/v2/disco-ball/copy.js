/* disco-ball — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Rəqsə qədər', en: 'Until we dance', ru: 'До танцев' } },
  venue:     { title: { az: 'Rəqs meydançası', en: 'The dance floor', ru: 'Танцпол' } },
  program:   { title: { az: 'Gecənin pleylisti', en: 'Tonight’s playlist', ru: 'Плейлист вечера' } },
  dresscode: { title: { az: 'Geyim — parılda!', en: 'Dress code — shine!', ru: 'Дресс-код — сияй!' } },
  seating:   { title: { az: 'Masan burada', en: 'Your table', ru: 'Твой стол' } },
  gallery:   { title: { az: 'Disko anları', en: 'Disco moments', ru: 'Диско-моменты' } },
  rsvp:      { title: { az: 'Rəqsə gəlirsən?', en: 'Ready to dance?', ru: 'Идёшь танцевать?' } },
  guestbook: { title: { az: 'Gəlinə arzular', en: 'Wishes for the bride', ru: 'Пожелания невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    disco: 'Disko gecəsi',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    disco: 'Disco night',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    disco: 'Диско-вечер',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['disco', 'hero', 'Dizayn mətni: «Disko gecəsi»'],
]
