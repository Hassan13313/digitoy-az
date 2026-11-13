/* business-card — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (korporativ seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qalan vaxt', en: 'Time remaining', ru: 'Осталось' } },
  venue:     { title: { az: 'Ünvan', en: 'Address', ru: 'Адрес' } },
  program:   { title: { az: 'Proqram', en: 'Schedule', ru: 'Программа' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Fotolar', en: 'Photos', ru: 'Фото' } },
  rsvp:      { title: { az: 'Cavab', en: 'Reply', ru: 'Ответ' } },
  guestbook: { title: { az: 'Qeydlər', en: 'Notes', ru: 'Заметки' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Az söz, aydın məqsəd, doğru insanlar',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Few words, clear purpose, the right people',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Меньше слов, ясная цель, нужные люди',
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
