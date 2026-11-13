/* keynote — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (korporativ seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Başlanğıca qədər', en: 'Starting in', ru: 'До начала' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место проведения' } },
  program:   { title: { az: 'Gündəm', en: 'Agenda', ru: 'Повестка' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Bəyiniz və masanız', en: 'Your badge and table', ru: 'Ваш бейдж и стол' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Highlights', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Qeydiyyat', en: 'Registration', ru: 'Регистрация' } },
  guestbook: { title: { az: 'Rəylər və təbriklər', en: 'Notes and congratulations', ru: 'Отзывы и поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Fikirlər səhnəyə çıxır — yerinizi tutun',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Ideas take the stage — take your seat',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Идеи выходят на сцену — займите своё место',
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
