/* teddy-bear — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Görüşə qədər', en: 'Until we meet', ru: 'До встречи' } },
  venue:     { title: { az: 'Harada?', en: 'Where?', ru: 'Где?' } },
  program:   { title: { az: 'Günün planı', en: 'Plan for the day', ru: 'План дня' } },
  dresscode: { title: { az: 'Geyim', en: 'What to wear', ru: 'Что надеть' } },
  seating:   { title: { az: 'Ayıcıq yerinizi göstərir', en: 'Teddy shows your seat', ru: 'Мишка покажет ваше место' } },
  gallery:   { title: { az: 'Şirin anlar', en: 'Sweet moments', ru: 'Милые моменты' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Körpəyə xoş sözlər', en: 'Kind words for the baby', ru: 'Тёплые слова малышу' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
]
