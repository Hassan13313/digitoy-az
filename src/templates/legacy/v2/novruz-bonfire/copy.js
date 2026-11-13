/* novruz-bonfire — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    table: 'Masa',
    fest: 'Novruz bayramı',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    fest: 'Novruz holiday',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    fest: 'Праздник Новруз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['fest', 'hero', 'Dizayn mətni: «Novruz bayramı»'],
]
