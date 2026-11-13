/* keynote — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Başlanğıca qədər', en: 'Starting in', ru: 'До начала' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место проведения' } },
  program:   { title: { az: 'Gündəm', en: 'Agenda', ru: 'Повестка' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Bəyiniz və masanız', en: 'Your badge and table', ru: 'Ваш бейдж и стол' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Highlights', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Qeydiyyat', en: 'Registration', ru: 'Регистрация' } },
  guestbook: { title: { az: 'Rəylər və təbriklər', en: 'Notes and congratulations', ru: 'Отзывы и поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    guest: 'Qonaq',
    host: 'Təşkilatçı',
    live: 'CANLI',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    guest: 'Guest',
    host: 'Hosted by',
    live: 'LIVE',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    guest: 'Гость',
    host: 'Организатор',
    live: 'В ЭФИРЕ',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['guest', 'seating', 'Dizayn mətni: «Qonaq»'],
  ['host', 'hero', 'Dizayn mətni: «Təşkilatçı»'],
  ['live', 'hero', 'Dizayn mətni: «CANLI»'],
]
