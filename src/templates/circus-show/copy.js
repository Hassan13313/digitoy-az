/* circus-show — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (uşaq ad günü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şouya qədər', en: 'Until showtime', ru: 'До начала шоу' } },
  venue:     { title: { az: 'Çadır burada', en: 'Find the big top', ru: 'Где наш шатёр' } },
  program:   { title: { az: 'Şou proqramı', en: 'Tonight’s acts', ru: 'Программа шоу' } },
  dresscode: { title: { az: 'Şou geyimi', en: 'Showtime attire', ru: 'Наряд для шоу' } },
  seating:   { title: { az: 'Arenada yeriniz', en: 'Your seat by the ring', ru: 'Ваше место у арены' } },
  gallery:   { title: { az: 'Afişa divarı', en: 'The poster wall', ru: 'Стена афиш' } },
  rsvp:      { title: { az: 'Şouya gələcəksiniz?', en: 'Coming to the show?', ru: 'Придёте на шоу?' } },
  guestbook: { title: { az: 'Alqışlar', en: 'Applause', ru: 'Аплодисменты' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Hörmətli qonaqlar, şou başlayır!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Ladies and gentlemen, the show begins!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Дамы и господа, шоу начинается!',
    table: 'Стол',
    end: 'До встречи',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Örtükdə «Aşağı sürüşdürün»'],
  ['line', 'countdown', 'Foto blokundakı sətir (sayğacdan sonra)'],
  ['table', 'seating', 'Masa kartındakı yazı'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
