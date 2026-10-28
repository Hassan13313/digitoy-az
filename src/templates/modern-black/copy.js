/* modern-black — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qalan vaxt', en: 'Time left', ru: 'Осталось' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место' } },
  program:   { title: { az: 'Proqram', en: 'Programme', ru: 'Программа' } },
  dresscode: { title: { az: 'Geyim kodu', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Fotolar', en: 'Photos', ru: 'Фото' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Wishes', ru: 'Поздравления' } },
}

export const TXT = {
  az: {
    brand: 'DIGITOY',
    date: 'Tarix',
    time: 'Saat',
    place: 'Məkan',
  },
  en: {
    brand: 'DIGITOY',
    date: 'Date',
    time: 'Time',
    place: 'Venue',
  },
  ru: {
    brand: 'DIGITOY',
    date: 'Дата',
    time: 'Время',
    place: 'Место',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['date', 'hero', 'Cədvəl — tarix'],
  ['time', 'hero', 'Cədvəl — saat'],
  ['place', 'hero', 'Cədvəl — məkan'],
]
