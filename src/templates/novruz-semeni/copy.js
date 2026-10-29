/* novruz-semeni — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bahar bayramına qədər', en: 'Until spring arrives', ru: 'До весеннего праздника' } },
  venue:     { title: { az: 'Süfrə harada açılır?', en: 'Where we gather', ru: 'Где собираемся?' } },
  program:   { title: { az: 'Bayram proqramı', en: 'Holiday programme', ru: 'Праздничная программа' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Bahar anları', en: 'Spring moments', ru: 'Весенние моменты' } },
  rsvp:      { title: { az: 'Bayrama gələcəksiniz?', en: 'Will you come?', ru: 'Придёте на праздник?' } },
  guestbook: { title: { az: 'Bayram təbrikləri', en: 'Holiday greetings', ru: 'Праздничные поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    fest: 'Novruz bayramı',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    fest: 'Novruz holiday',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    fest: 'Праздник Новруз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['fest', 'hero', 'Dizayn mətni: «Novruz bayramı»'],
]
