/* silver-locket — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qədər', en: 'Until we celebrate', ru: 'До праздника' } },
  venue:     { title: { az: 'Görüş yeri', en: 'Where we meet', ru: 'Место встречи' } },
  program:   { title: { az: 'Axşamın gedişi', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you join us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Cütlüyə arzular', en: 'Wishes for the couple', ru: 'Пожелания паре' } },
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
