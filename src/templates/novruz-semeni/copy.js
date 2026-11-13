/* novruz-semeni — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (bayram gecələri seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bahar bayramına qədər', en: 'Until spring arrives', ru: 'До весеннего праздника' } },
  venue:     { title: { az: 'Süfrə harada açılır?', en: 'Where we gather', ru: 'Где собираемся?' } },
  program:   { title: { az: 'Bayram proqramı', en: 'Holiday programme', ru: 'Праздничная программа' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Bahar anları', en: 'Spring moments', ru: 'Весенние моменты' } },
  rsvp:      { title: { az: 'Bayrama gələcəksiniz?', en: 'Will you come?', ru: 'Придёте на праздник?' } },
  guestbook: { title: { az: 'Bayram təbrikləri', en: 'Holiday greetings', ru: 'Праздничные поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Səməni göyərdi, süfrə bəzəndi — bahar sizinlə gəlsin',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The semeni has grown, the table is set — may spring come with you',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Самани взошло, стол накрыт — пусть весна придёт с вами',
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
