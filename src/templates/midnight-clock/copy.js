/* midnight-clock — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (bayram gecələri seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecə yarısına qədər', en: 'Until midnight', ru: 'До полуночи' } },
  venue:     { title: { az: 'Harada qarşılayırıq?', en: 'Where we ring it in', ru: 'Где встречаем?' } },
  program:   { title: { az: 'Gecənin saatları', en: 'Hours of the night', ru: 'Часы этой ночи' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Gecənin işıqları', en: 'Lights of the night', ru: 'Огни этой ночи' } },
  rsvp:      { title: { az: 'Bizimlə qarşılayacaqsınız?', en: 'Will you ring it in with us?', ru: 'Встретите с нами?' } },
  guestbook: { title: { az: 'Yeni il arzuları', en: 'New Year wishes', ru: 'Новогодние пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Saat on ikini vuranda birlikdə olaq',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Let’s be together when the clock strikes twelve',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Будем вместе, когда часы пробьют двенадцать',
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
