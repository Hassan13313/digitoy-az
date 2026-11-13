/* red-veil — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Xına gecəsinə qədər', en: 'Until the henna night', ru: 'До вечера хны' } },
  venue:     { title: { az: 'Gecənin ünvanı', en: 'Where we gather', ru: 'Где мы соберёмся' } },
  program:   { title: { az: 'Gecənin ahəngi', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Gecənin libası', en: 'Evening attire', ru: 'Наряд вечера' } },
  seating:   { title: { az: 'Yeriniz hazırdır', en: 'Your seat awaits', ru: 'Ваше место готово' } },
  gallery:   { title: { az: 'Gecənin xatirələri', en: 'Memories of the night', ru: 'Воспоминания вечера' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you join us?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Gəlinə xoş sözlər', en: 'Kind words for the bride', ru: 'Тёплые слова невесте' } },
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
