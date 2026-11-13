/* roller-shutter — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (açılış və təqdimat seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Açılışa qalan vaxt', en: 'Time to opening', ru: 'До открытия' } },
  venue:     { title: { az: 'Ünvan', en: 'Location', ru: 'Адрес' } },
  program:   { title: { az: 'Açılış günü', en: 'Opening day', ru: 'День открытия' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your spot', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Shots', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Coming?', ru: 'Придёте?' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Congrats', ru: 'Поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Jalüz qalxır — qapımız sizə açıqdır',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The shutter rises — our door is open to you',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Ставни поднимаются — наши двери открыты',
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
