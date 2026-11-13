/* caps-toss — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (məzuniyyət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Böyük günə qədər', en: 'Until the big day', ru: 'До большого дня' } },
  venue:     { title: { az: 'Məzun gecəsi harada?', en: 'Where is the party?', ru: 'Где выпускной?' } },
  program:   { title: { az: 'Gecənin proqramı', en: 'Programme', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'Məzun anları', en: 'Graduation moments', ru: 'Моменты выпускного' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Məzuna arzular', en: 'Wishes for the graduate', ru: 'Пожелания выпускнику' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'İllərin zəhməti bu gecə papaqla birlikdə göyə uçur',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Years of hard work fly up with the caps tonight',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Годы труда взлетают сегодня вместе с шапками',
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
