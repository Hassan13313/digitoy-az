/* paris-night — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (qız gecəsi seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Parisə qədər', en: 'Until Paris', ru: 'До Парижа' } },
  venue:     { title: { az: 'Görüş yeri', en: 'Rendez-vous', ru: 'Место встречи' } },
  program:   { title: { az: 'Gecənin menyusu', en: 'Tonight’s menu', ru: 'Меню вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masan hazırdır', en: 'Your table', ru: 'Твой стол' } },
  gallery:   { title: { az: 'Paris xatirələri', en: 'Paris memories', ru: 'Парижские снимки' } },
  rsvp:      { title: { az: 'Gəlirsən?', en: 'Will you come?', ru: 'Придёшь?' } },
  guestbook: { title: { az: 'Gəlinə məktublar', en: 'Letters to the bride', ru: 'Письма невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bonsoir! Bir gecəlik Paris — sənin şərəfinə',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Bonsoir! Paris for one night — in your honour',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Bonsoir! Один вечер в Париже — в твою честь',
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
