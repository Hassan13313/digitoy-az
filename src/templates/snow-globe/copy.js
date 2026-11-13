/* snow-globe — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (bayram gecələri seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama neçə gün qaldı?', en: 'How long till the holiday?', ru: 'Сколько до праздника?' } },
  venue:     { title: { az: 'Harada görüşürük?', en: 'Where we meet', ru: 'Где встречаемся?' } },
  program:   { title: { az: 'Bayram axşamı', en: 'Holiday evening', ru: 'Праздничный вечер' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin üçün hədiyyə', en: 'A tag for you', ru: 'Ярлычок для вас' } },
  gallery:   { title: { az: 'Qış anları', en: 'Winter moments', ru: 'Зимние моменты' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you join us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Bayram açıqcaları', en: 'Holiday cards', ru: 'Праздничные открытки' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Qar yağır, ocaq yanır — gəlin isinək',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Snow is falling, the fire is lit — come warm up with us',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Идёт снег, горит камин — приходите греться',
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
