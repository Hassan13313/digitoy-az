/* xonca — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (xına seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şamlar yanana qədər', en: 'Until the candles are lit', ru: 'Пока не зажгутся свечи' } },
  venue:     { title: { az: 'Xonça harada açılacaq?', en: 'Where the tray awaits', ru: 'Где нас ждёт хонча' } },
  program:   { title: { az: 'Gecənin şamları', en: 'Candles of the night', ru: 'Свечи вечера' } },
  dresscode: { title: { az: 'Gecəyə yaraşan libas', en: 'Dressing for the night', ru: 'Наряд для вечера' } },
  seating:   { title: { az: 'Sizin masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Xonça başında', en: 'Around the tray', ru: 'Вокруг хончи' } },
  rsvp:      { title: { az: 'Sizi gözləyirik', en: 'We await you', ru: 'Мы вас ждём' } },
  guestbook: { title: { az: 'Xonçaya bir arzu', en: 'A wish for the tray', ru: 'Пожелание к хонче' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Xonçalar bəzənib, şamlar yanır',
    table: 'Masa',
    end: 'Xonçanın işığında görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The trays are dressed, the candles are lit',
    table: 'Table',
    end: 'See you in the glow of the xonça',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Хончи украшены, свечи горят',
    table: 'Стол',
    end: 'До встречи в свете хончи',
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
