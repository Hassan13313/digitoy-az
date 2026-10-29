/* little-pilot — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Uçuşa qədər', en: 'Until take-off', ru: 'До взлёта' } },
  venue:     { title: { az: 'Eniş meydançası', en: 'Landing strip', ru: 'Посадочная площадка' } },
  program:   { title: { az: 'Uçuş marşrutu', en: 'Flight route', ru: 'Маршрут полёта' } },
  dresscode: { title: { az: 'Ekipaj forması', en: 'Crew uniform', ru: 'Форма экипажа' } },
  seating:   { title: { az: 'Bortda yeriniz', en: 'Your seat on board', ru: 'Ваше место на борту' } },
  gallery:   { title: { az: 'Pəncərədən görünənlər', en: 'Views from the window', ru: 'Вид из иллюминатора' } },
  rsvp:      { title: { az: 'Bortda olacaqsınız?', en: 'Will you be on board?', ru: 'Будете на борту?' } },
  guestbook: { title: { az: 'Pilota mesaj', en: 'Message to the pilot', ru: 'Послание пилоту' } },
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
