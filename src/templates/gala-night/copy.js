/* gala-night — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (korporativ seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecəyə qalan vaxt', en: 'Until the gala', ru: 'До гала-вечера' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место' } },
  program:   { title: { az: 'Gecənin proqramı', en: 'Evening programme', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yer kartınız', en: 'Your place card', ru: 'Ваша карточка места' } },
  gallery:   { title: { az: 'Gecənin işıqları', en: 'Gala highlights', ru: 'Яркие моменты вечера' } },
  rsvp:      { title: { az: 'İştirakınızı təsdiqləyin', en: 'Kindly confirm', ru: 'Подтвердите участие' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Congratulations', ru: 'Поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bir gecə, bir zal və ən gözəl şirkət — sizinlə',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'One night, one hall and the finest company — you',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Один вечер, один зал и лучшая компания — вы',
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
