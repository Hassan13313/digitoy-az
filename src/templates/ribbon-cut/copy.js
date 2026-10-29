/* ribbon-cut — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Açılışa qədər', en: 'Until the opening', ru: 'До открытия' } },
  venue:     { title: { az: 'Ünvanımız', en: 'Find us', ru: 'Наш адрес' } },
  program:   { title: { az: 'Açılış proqramı', en: 'Opening programme', ru: 'Программа открытия' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Açılış anları', en: 'Opening moments', ru: 'Моменты открытия' } },
  rsvp:      { title: { az: 'İştirakınızı təsdiqləyin', en: 'Confirm your attendance', ru: 'Подтвердите участие' } },
  guestbook: { title: { az: 'Təbrikləriniz', en: 'Your congratulations', ru: 'Ваши поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    grand: 'Təntənəli açılış',
    vip: 'Dəvətli qonaq',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    grand: 'Grand opening',
    vip: 'Invited guest',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    grand: 'Торжественное открытие',
    vip: 'Приглашённый гость',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['grand', 'hero', 'Dizayn mətni: «Təntənəli açılış»'],
  ['vip', 'seating', 'Dizayn mətni: «Dəvətli qonaq»'],
]
