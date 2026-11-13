/* balloon-party — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (uşaq ad günü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qədər', en: 'Until the party', ru: 'До праздника' } },
  venue:     { title: { az: 'Bayram harada?', en: 'Where is the party?', ru: 'Где праздник?' } },
  program:   { title: { az: 'Bayram tortu', en: 'The party cake', ru: 'Праздничный торт' } },
  dresscode: { title: { az: 'Bayram geyimi', en: 'Party outfit', ru: 'Праздничный наряд' } },
  seating:   { title: { az: 'Şirin sürpriz', en: 'A sweet surprise', ru: 'Сладкий сюрприз' } },
  gallery:   { title: { az: 'Bayram anları', en: 'Party moments', ru: 'Моменты праздника' } },
  rsvp:      { title: { az: 'Bayrama gələcəksiniz?', en: 'Coming to the party?', ru: 'Придёте на праздник?' } },
  guestbook: { title: { az: 'Arzu şarları', en: 'Wish balloons', ru: 'Шарики с пожеланиями' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Şarlar hazırdır, tort bəzənib — bayram başlayır!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The balloons are up, the cake is ready — let the party begin!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Шары надуты, торт готов — праздник начинается!',
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
