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
    sign1: 'Uğurlar!',
    sign2: 'Unutma bizi!',
    sign3: 'Sən bacarırsan!',
    sign4: 'Ən yaxşı sinif!',
    brand: 'Digitoy',
    table: 'Masa',
    classOf: 'Məzun {y}',
  },
  en: {
    sign1: 'Good luck!',
    sign2: 'Don’t forget us!',
    sign3: 'You got this!',
    sign4: 'Best class ever!',
    brand: 'Digitoy',
    table: 'Table',
    classOf: 'Class of {y}',
  },
  ru: {
    sign1: 'Удачи!',
    sign2: 'Не забывай нас!',
    sign3: 'У тебя всё получится!',
    sign4: 'Лучший класс!',
    brand: 'Digitoy',
    table: 'Стол',
    classOf: 'Выпуск {y}',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['sign1', 'hero', 'İmza 1'],
  ['sign2', 'hero', 'İmza 2'],
  ['sign3', 'hero', 'İmza 3 (açılış)'],
  ['sign4', 'hero', 'İmza 4 (açılış)'],
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['classOf', 'hero', 'Dizayn mətni: «Məzun {y}»', '{y} — avtomatik dəyər (il), silməyin'],
]
