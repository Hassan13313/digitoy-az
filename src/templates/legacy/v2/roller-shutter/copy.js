/* roller-shutter — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Açılışa qalan vaxt', en: 'Time to opening', ru: 'До открытия' } },
  venue:     { title: { az: 'Ünvan', en: 'Location', ru: 'Адрес' } },
  program:   { title: { az: 'Açılış günü', en: 'Opening day', ru: 'День открытия' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your spot', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Shots', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Coming?', ru: 'Придёте?' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Congrats', ru: 'Поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    open: 'Açıq',
    soon: 'Tezliklə',
    opening: 'Açılış',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    open: 'Open',
    soon: 'Coming soon',
    opening: 'Opening',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    open: 'Открыто',
    soon: 'Скоро',
    opening: 'Открытие',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['open', 'hero', 'Dizayn mətni: «Açıq»'],
  ['opening', 'hero', 'Dizayn mətni: «Açılış»'],
]
