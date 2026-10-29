/* paris-night — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Parisə qədər', en: 'Until Paris', ru: 'До Парижа' } },
  venue:     { title: { az: 'Görüş yeri', en: 'Rendez-vous', ru: 'Место встречи' } },
  program:   { title: { az: 'Gecənin menyusu', en: 'Tonight’s menu', ru: 'Меню вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masan hazırdır', en: 'Your table', ru: 'Твой стол' } },
  gallery:   { title: { az: 'Paris xatirələri', en: 'Paris memories', ru: 'Парижские снимки' } },
  rsvp:      { title: { az: 'Gəlirsən?', en: 'Will you come?', ru: 'Придёшь?' } },
  guestbook: { title: { az: 'Gəlinə məktublar', en: 'Letters to the bride', ru: 'Письма невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    ooh: 'Ooh là là!',
    menu: 'Menyu',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    ooh: 'Ooh là là!',
    menu: 'Menu',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    ooh: 'Ooh là là!',
    menu: 'Меню',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['ooh', 'hero', 'Dizayn mətni: «Ooh là là!»'],
  ['menu', 'program', 'Dizayn mətni: «Menyu»'],
]
