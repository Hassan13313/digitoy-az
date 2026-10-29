/* pajama-spa — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Pijamaları hazırla', en: 'Get your pajamas ready', ru: 'Готовь пижаму' } },
  venue:     { title: { az: 'Harada?', en: 'Where?', ru: 'Где?' } },
  program:   { title: { az: 'Gecənin planı', en: 'The plan', ru: 'План вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yerin hazırdır', en: 'Your spot', ru: 'Твоё место' } },
  gallery:   { title: { az: 'Gecə şəkilləri', en: 'Night snaps', ru: 'Ночные фото' } },
  rsvp:      { title: { az: 'Gəlirsən?', en: 'Coming?', ru: 'Придёшь?' } },
  guestbook: { title: { az: 'Gəlinə sözlər', en: 'Notes for the bride', ru: 'Слова невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    party: 'Pijama partisi!',
    zzz: 'z z z',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    party: 'Pajama party!',
    zzz: 'z z z',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    party: 'Пижамная вечеринка!',
    zzz: 'z z z',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['party', 'hero', 'Dizayn mətni: «Pijama partisi!»'],
  ['zzz', 'hero', 'Dizayn mətni: «z z z»'],
]
