/* henna-buta — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (xına seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Xına yaxılana qədər', en: 'Until the henna is applied', ru: 'До нанесения хны' } },
  venue:     { title: { az: 'Gecənin məkanı', en: 'The venue', ru: 'Место вечера' } },
  program:   { title: { az: 'Gecənin naxışı', en: 'The pattern of the night', ru: 'Узор вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'What to wear', ru: 'Что надеть' } },
  seating:   { title: { az: 'Yerinizi tapın', en: 'Find your seat', ru: 'Найдите своё место' } },
  gallery:   { title: { az: 'Naxışlı anlar', en: 'Patterned moments', ru: 'Узорные моменты' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Gəlinin ovucuna bir arzu', en: 'A wish in the bride’s palm', ru: 'Пожелание на ладони невесты' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Hər naxış bir dua, hər buta bir arzu',
    table: 'Masa',
    end: 'Xına gecəsində görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Every pattern a prayer, every buta a wish',
    table: 'Table',
    end: 'Until the henna night',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Каждый узор — молитва, каждая бута — мечта',
    table: 'Стол',
    end: 'До встречи на вечере хны',
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
