/* yearbook — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Zəngə qədər', en: 'Until the bell', ru: 'До звонка' } },
  venue:     { title: { az: 'Görüş nöqtəsi', en: 'Meeting point', ru: 'Место встречи' } },
  program:   { title: { az: 'Gecənin planı', en: 'Tonight’s plan', ru: 'План вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sənin masan', en: 'Your table', ru: 'Твой стол' } },
  gallery:   { title: { az: 'Albomun səhifələri', en: 'Yearbook pages', ru: 'Страницы альбома' } },
  rsvp:      { title: { az: 'Gəlirsən?', en: 'You coming?', ru: 'Придёшь?' } },
  guestbook: { title: { az: 'Albomuma yaz', en: 'Sign my yearbook', ru: 'Подпиши мой альбом' } },
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
