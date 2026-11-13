/* chalkboard — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (məzuniyyət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
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
    line: 'Lövhədəki son dərs: gələcək sizindir!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The last lesson on the board: the future is yours!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Последний урок на доске: будущее за вами!',
    table: 'Стол',
    end: 'До встречи',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Örtükdə «Aşağı sürüşdürün»'],
  ['line', 'countdown', 'Foto blokundakı sətir (sayğacdan sonra)'],
  ['table', 'seating', 'Masa kartındakı yazı'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
