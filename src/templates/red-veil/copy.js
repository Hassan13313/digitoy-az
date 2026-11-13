/* red-veil — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (xına seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Xına gecəsinə qədər', en: 'Until the henna night', ru: 'До вечера хны' } },
  venue:     { title: { az: 'Gecənin ünvanı', en: 'Where we gather', ru: 'Где мы соберёмся' } },
  program:   { title: { az: 'Gecənin ahəngi', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Gecənin libası', en: 'Evening attire', ru: 'Наряд вечера' } },
  seating:   { title: { az: 'Yeriniz hazırdır', en: 'Your seat awaits', ru: 'Ваше место готово' } },
  gallery:   { title: { az: 'Gecənin xatirələri', en: 'Memories of the night', ru: 'Воспоминания вечера' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you join us?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Gəlinə xoş sözlər', en: 'Kind words for the bride', ru: 'Тёплые слова невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bu gecə xına yaxılır, ürəklər birləşir',
    table: 'Masa',
    end: 'Şam işığında görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Tonight the henna is laid, two hearts join',
    table: 'Table',
    end: 'See you by candlelight',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Сегодня наносят хну — сердца соединяются',
    table: 'Стол',
    end: 'До встречи при свечах',
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
