/* balloon-party — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qədər', en: 'Until the party', ru: 'До праздника' } },
  venue:     { title: { az: 'Bayram harada?', en: 'Where is the party?', ru: 'Где праздник?' } },
  program:   { title: { az: 'Bayram tortu', en: 'The party cake', ru: 'Праздничный торт' } },
  dresscode: { title: { az: 'Bayram geyimi', en: 'Party outfit', ru: 'Праздничный наряд' } },
  seating:   { title: { az: 'Şirin sürpriz', en: 'A sweet surprise', ru: 'Сладкий сюрприз' } },
  gallery:   { title: { az: 'Bayram anları', en: 'Party moments', ru: 'Моменты праздника' } },
  rsvp:      { title: { az: 'Bayrama gələcəksiniz?', en: 'Coming to the party?', ru: 'Придёте на праздник?' } },
  guestbook: { title: { az: 'Arzu şarları', en: 'Wish balloons', ru: 'Шарики с пожеланиями' } },
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
