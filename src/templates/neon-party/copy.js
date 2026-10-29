/* neon-party — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Partiyə qədər', en: 'Until the party', ru: 'До вечеринки' } },
  venue:     { title: { az: 'Harada?', en: 'Where?', ru: 'Где?' } },
  program:   { title: { az: 'Gecənin ritmi', en: 'Rhythm of the night', ru: 'Ритм ночи' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Neon kadrlar', en: 'Neon shots', ru: 'Неоновые кадры' } },
  rsvp:      { title: { az: 'Gəlirsiniz?', en: 'Are you in?', ru: 'Вы с нами?' } },
  guestbook: { title: { az: 'Divara yazın', en: 'Write on the wall', ru: 'Напишите на стене' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    host: 'Təşkilatçı',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    host: 'Hosted by',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    host: 'Организатор',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['host', 'hero', 'Dizayn mətni: «Təşkilatçı»'],
]
