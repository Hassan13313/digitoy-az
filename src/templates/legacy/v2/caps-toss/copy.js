/* caps-toss — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Böyük günə qədər', en: 'Until the big day', ru: 'До большого дня' } },
  venue:     { title: { az: 'Məzun gecəsi harada?', en: 'Where is the party?', ru: 'Где выпускной?' } },
  program:   { title: { az: 'Gecənin proqramı', en: 'Programme', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'Məzun anları', en: 'Graduation moments', ru: 'Моменты выпускного' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Məzuna arzular', en: 'Wishes for the graduate', ru: 'Пожелания выпускнику' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    classOf: 'Məzun {y}',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    classOf: 'Class of {y}',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    classOf: 'Выпуск {y}',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['classOf', 'hero', 'Dizayn mətni: «Məzun {y}»', '{y} — avtomatik dəyər (il), silməyin'],
]
