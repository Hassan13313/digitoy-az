/* last-bell — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Son zəngə qədər', en: 'Until the last bell', ru: 'До последнего звонка' } },
  venue:     { title: { az: 'Harada qeyd edirik?', en: 'Where we celebrate', ru: 'Где празднуем?' } },
  program:   { title: { az: 'Gecənin cədvəli', en: 'Timetable', ru: 'Расписание вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Məktəb xatirələri', en: 'School memories', ru: 'Школьные воспоминания' } },
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
