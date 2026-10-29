/* chalkboard — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Zəngə nə qədər qaldı?', en: 'How long till the bell?', ru: 'Сколько до звонка?' } },
  venue:     { title: { az: 'Ünvan', en: 'Address', ru: 'Адрес' } },
  program:   { title: { az: 'Bu axşamın dərsləri', en: 'Tonight’s lessons', ru: 'Уроки этого вечера' } },
  dresscode: { title: { az: 'Geyim forması', en: 'Uniform', ru: 'Форма одежды' } },
  seating:   { title: { az: 'Yerin hardadır?', en: 'Where do you sit?', ru: 'Где твоё место?' } },
  gallery:   { title: { az: 'Sinif lövhəsi', en: 'Class board', ru: 'Классная доска' } },
  rsvp:      { title: { az: 'Yoxlama', en: 'Roll call', ru: 'Перекличка' } },
  guestbook: { title: { az: 'Lövhəyə yaz', en: 'Write on the board', ru: 'Напиши на доске' } },
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
