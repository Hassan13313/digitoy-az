/* ribbon-cut — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (açılış və təqdimat seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Açılışa qədər', en: 'Until the opening', ru: 'До открытия' } },
  venue:     { title: { az: 'Ünvanımız', en: 'Find us', ru: 'Наш адрес' } },
  program:   { title: { az: 'Açılış proqramı', en: 'Opening programme', ru: 'Программа открытия' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Açılış anları', en: 'Opening moments', ru: 'Моменты открытия' } },
  rsvp:      { title: { az: 'İştirakınızı təsdiqləyin', en: 'Confirm your attendance', ru: 'Подтвердите участие' } },
  guestbook: { title: { az: 'Təbrikləriniz', en: 'Your congratulations', ru: 'Ваши поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Lent kəsilir, qapılar açılır — sizi gözləyirik!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The ribbon is cut, the doors open — we await you!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Лента перерезана, двери открыты — ждём вас!',
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
