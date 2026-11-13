/* award-night — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (korporativ seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Mərasimə qədər', en: 'Until the ceremony', ru: 'До церемонии' } },
  venue:     { title: { az: 'Mərasim zalı', en: 'Ceremony hall', ru: 'Зал церемонии' } },
  program:   { title: { az: 'Mərasimin gedişi', en: 'Order of the ceremony', ru: 'Ход церемонии' } },
  dresscode: { title: { az: 'Qırmızı xalça', en: 'Red carpet attire', ru: 'Красная дорожка' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Qalib anlar', en: 'Winning moments', ru: 'Победные моменты' } },
  rsvp:      { title: { az: 'İştirakınızı təsdiqləyin', en: 'Kindly confirm', ru: 'Подтвердите участие' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Congratulations', ru: 'Поздравления' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bu gecə ən layiqlilər səhnəyə çıxır',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Tonight the most deserving take the stage',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Сегодня на сцену выходят самые достойные',
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
