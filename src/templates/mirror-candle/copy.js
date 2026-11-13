/* mirror-candle — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (xına seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şamlar yanana qədər', en: 'Until the candles glow', ru: 'Пока не зажгутся свечи' } },
  venue:     { title: { az: 'İşığın yeri', en: 'Where the light gathers', ru: 'Где собирается свет' } },
  program:   { title: { az: 'Gecənin işıqları', en: 'Lights of the evening', ru: 'Огни вечера' } },
  dresscode: { title: { az: 'Güzgüyə yaraşan', en: 'Worthy of the mirror', ru: 'Достойно зеркала' } },
  seating:   { title: { az: 'Güzgüdə yeriniz', en: 'Your place in the mirror', ru: 'Ваше место в зеркале' } },
  gallery:   { title: { az: 'Əks olunan anlar', en: 'Reflected moments', ru: 'Отражённые мгновения' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you be there?', ru: 'Вы будете?' } },
  guestbook: { title: { az: 'İşıqlı arzular', en: 'Bright wishes', ru: 'Светлые пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Güzgüyə işıq, ürəyə sevinc düşür',
    table: 'Masa',
    end: 'Şamlar sönməmiş görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Light falls on the mirror, joy on the heart',
    table: 'Table',
    end: 'Meet us before the candles burn low',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Свет — в зеркало, радость — в сердце',
    table: 'Стол',
    end: 'Встретимся, пока горят свечи',
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
