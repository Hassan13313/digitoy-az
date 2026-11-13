/* business-card — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qalan vaxt', en: 'Time remaining', ru: 'Осталось' } },
  venue:     { title: { az: 'Ünvan', en: 'Address', ru: 'Адрес' } },
  program:   { title: { az: 'Proqram', en: 'Schedule', ru: 'Программа' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Fotolar', en: 'Photos', ru: 'Фото' } },
  rsvp:      { title: { az: 'Cavab', en: 'Reply', ru: 'Ответ' } },
  guestbook: { title: { az: 'Qeydlər', en: 'Notes', ru: 'Заметки' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    date: 'Tarix',
    time: 'Saat',
    venue: 'Məkan',
    host: 'Təşkilatçı',
    guest: 'Qonaq',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    date: 'Date',
    time: 'Time',
    venue: 'Venue',
    host: 'Host',
    guest: 'Guest',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    date: 'Дата',
    time: 'Время',
    venue: 'Место',
    host: 'Организатор',
    guest: 'Гость',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['date', 'hero', 'Dizayn mətni: «Tarix»'],
  ['time', 'hero', 'Dizayn mətni: «Saat»'],
  ['venue', 'hero', 'Dizayn mətni: «Məkan»'],
  ['host', 'hero', 'Dizayn mətni: «Təşkilatçı»'],
  ['guest', 'seating', 'Dizayn mətni: «Qonaq»'],
]
