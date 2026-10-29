/* midnight-clock — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecə yarısına qədər', en: 'Until midnight', ru: 'До полуночи' } },
  venue:     { title: { az: 'Harada qarşılayırıq?', en: 'Where we ring it in', ru: 'Где встречаем?' } },
  program:   { title: { az: 'Gecənin saatları', en: 'Hours of the night', ru: 'Часы этой ночи' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Gecənin işıqları', en: 'Lights of the night', ru: 'Огни этой ночи' } },
  rsvp:      { title: { az: 'Bizimlə qarşılayacaqsınız?', en: 'Will you ring it in with us?', ru: 'Встретите с нами?' } },
  guestbook: { title: { az: 'Yeni il arzuları', en: 'New Year wishes', ru: 'Новогодние пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    welcome: 'Xoş gəldin, {y}!',
    ny: 'Yeni il',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    welcome: 'Hello, {y}!',
    ny: 'New Year',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    welcome: 'Здравствуй, {y}!',
    ny: 'Новый год',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['welcome', 'hero', 'Dizayn mətni: «Xoş gəldin, {y}!»', '{y} — avtomatik dəyər (il), silməyin'],
  ['ny', 'hero', 'Dizayn mətni: «Yeni il»'],
]
