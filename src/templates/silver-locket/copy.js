/* silver-locket — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (ildönümü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bayrama qədər', en: 'Until we celebrate', ru: 'До праздника' } },
  venue:     { title: { az: 'Görüş yeri', en: 'Where we meet', ru: 'Место встречи' } },
  program:   { title: { az: 'Axşamın gedişi', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you join us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Cütlüyə arzular', en: 'Wishes for the couple', ru: 'Пожелания паре' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Birlikdə keçən hər il ürəyimizdə həkk olunub',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Every year together is engraved in our hearts',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Каждый год вместе выгравирован в наших сердцах',
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
