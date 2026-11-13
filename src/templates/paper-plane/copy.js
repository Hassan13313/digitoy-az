/* paper-plane — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (məzuniyyət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Uçuşa qədər', en: 'Until take-off', ru: 'До вылета' } },
  venue:     { title: { az: 'Eniş nöqtəsi', en: 'Landing point', ru: 'Точка посадки' } },
  program:   { title: { az: 'Gecənin marşrutu', en: 'Route of the night', ru: 'Маршрут вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin ünvanınız', en: 'Your destination', ru: 'Ваш адрес' } },
  gallery:   { title: { az: 'Yol boyu kadrlar', en: 'Snapshots on the way', ru: 'Кадры в пути' } },
  rsvp:      { title: { az: 'Bizimlə uçursunuz?', en: 'Flying with us?', ru: 'Летите с нами?' } },
  guestbook: { title: { az: 'Gələcəyə arzular', en: 'Wishes for the future', ru: 'Пожелания в будущее' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Arzularımızı kağız təyyarə ilə gələcəyə göndəririk',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'We send our dreams to the future on a paper plane',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Отправляем мечты в будущее бумажным самолётиком',
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
