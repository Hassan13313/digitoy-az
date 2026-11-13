/* first-paper — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (ildönümü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qədər', en: 'Until the day', ru: 'До праздника' } },
  venue:     { title: { az: 'Harada?', en: 'Where?', ru: 'Где?' } },
  program:   { title: { az: 'Axşamın planı', en: 'Plan for the evening', ru: 'План вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'What to wear', ru: 'Что надеть' } },
  seating:   { title: { az: 'Masa kartınız', en: 'Your place card', ru: 'Ваша карточка' } },
  gallery:   { title: { az: 'Bir ilin şəkilləri', en: 'A year in photos', ru: 'Год в фотографиях' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Придёте?' } },
  guestbook: { title: { az: 'Kağıza bir neçə söz', en: 'A few words on paper', ru: 'Пара слов на бумаге' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bir il, bir vərəq — hekayəmizin ilk səhifəsi',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'One year, one sheet — the first page of our story',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Один год, один лист — первая страница нашей истории',
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
