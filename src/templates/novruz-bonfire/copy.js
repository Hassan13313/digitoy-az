/* novruz-bonfire — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (bayram gecələri seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qədər', en: 'Until the holiday', ru: 'До праздника' } },
  venue:     { title: { az: 'Tonqal harada yanacaq?', en: 'Where the fire burns', ru: 'Где зажжём костёр?' } },
  program:   { title: { az: 'Bayram gecəsi', en: 'Holiday night', ru: 'Праздничная ночь' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Süfrədəki yeriniz', en: 'Your place at the table', ru: 'Ваше место за столом' } },
  gallery:   { title: { az: 'Bayram anları', en: 'Holiday moments', ru: 'Праздничные моменты' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you join us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Bayram arzuları', en: 'Holiday wishes', ru: 'Праздничные пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Tonqal yanır, bahar gəlir — bayramınız mübarək!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The bonfire burns, spring arrives — happy Novruz!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Костёр горит, весна пришла — с праздником!',
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
