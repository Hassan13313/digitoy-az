/* gala-night — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecəyə qalan vaxt', en: 'Until the gala', ru: 'До гала-вечера' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место' } },
  program:   { title: { az: 'Gecənin proqramı', en: 'Evening programme', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yer kartınız', en: 'Your place card', ru: 'Ваша карточка места' } },
  gallery:   { title: { az: 'Gecənin işıqları', en: 'Gala highlights', ru: 'Яркие моменты вечера' } },
  rsvp:      { title: { az: 'İştirakınızı təsdiqləyin', en: 'Kindly confirm', ru: 'Подтвердите участие' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Congratulations', ru: 'Поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    host: 'Təşkilatçı',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    host: 'Hosted by',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    host: 'Организатор',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['host', 'hero', 'Dizayn mətni: «Təşkilatçı»'],
]
