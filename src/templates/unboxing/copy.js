/* unboxing — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Təqdimata qədər', en: 'Until the reveal', ru: 'До презентации' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место' } },
  program:   { title: { az: 'Təqdimat planı', en: 'Launch agenda', ru: 'План презентации' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Giriş kartınız', en: 'Your pass', ru: 'Ваш пропуск' } },
  gallery:   { title: { az: 'Təqdimat anları', en: 'Launch moments', ru: 'Моменты презентации' } },
  rsvp:      { title: { az: 'Yerinizi təsdiqləyin', en: 'Reserve your spot', ru: 'Подтвердите место' } },
  guestbook: { title: { az: 'Rəyləriniz', en: 'Your words', ru: 'Ваши отзывы' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    fresh: 'Yeni',
    launch: 'Təqdimat',
    pass: 'Giriş kartı',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    fresh: 'New',
    launch: 'Launch',
    pass: 'Access pass',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    fresh: 'Новинка',
    launch: 'Презентация',
    pass: 'Пропуск',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['fresh', 'hero', 'Dizayn mətni: «Yeni»'],
  ['launch', 'hero', 'Dizayn mətni: «Təqdimat»'],
  ['pass', 'seating', 'Dizayn mətni: «Giriş kartı»'],
]
