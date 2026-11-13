/* pajama-spa — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (qız gecəsi seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
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
    line: 'Pijamanı geyin, yastığını götür — gecə bizimdir!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Grab your pajamas and pillow — tonight is ours!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Пижама, подушка — эта ночь наша!',
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
