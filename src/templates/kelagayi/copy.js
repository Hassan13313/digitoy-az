/* kelagayi — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (xına seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecəyə qalan vaxt', en: 'Time until the night', ru: 'До вечера осталось' } },
  venue:     { title: { az: 'Ünvan', en: 'The address', ru: 'Адрес' } },
  program:   { title: { az: 'Gecənin naxışı', en: 'The evening’s pattern', ru: 'Узор вечера' } },
  dresscode: { title: { az: 'Libas', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'İpək kimi anlar', en: 'Silken moments', ru: 'Шёлковые мгновения' } },
  rsvp:      { title: { az: 'Cavabınızı gözləyirik', en: 'We await your reply', ru: 'Ждём вашего ответа' } },
  guestbook: { title: { az: 'Kəlağayıya düyün — bir arzu', en: 'Tie a wish to the scarf', ru: 'Завяжите желание на платке' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'İpək kəlağayı altında bir ömür arzusu',
    table: 'Masa',
    end: 'Kəlağayı açılanda görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'A lifetime’s wish beneath a silk kelagayi',
    table: 'Table',
    end: 'See you when the kelagayi unfolds',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Мечта длиною в жизнь под шёлковым келагаи',
    table: 'Стол',
    end: 'До встречи, когда раскроется келагаи',
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
