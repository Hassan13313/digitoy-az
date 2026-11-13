/* bistro-sign — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (açılış və təqdimat seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qapılar açılana qədər', en: 'Until the doors open', ru: 'До открытия дверей' } },
  venue:     { title: { az: 'Bizi burada tapın', en: 'Find us here', ru: 'Найдите нас здесь' } },
  program:   { title: { az: 'Günün menyusu', en: 'Menu of the day', ru: 'Меню дня' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin üçün rezerv', en: 'Reserved for you', ru: 'Зарезервировано для вас' } },
  gallery:   { title: { az: 'İçəridən görüntülər', en: 'A look inside', ru: 'Взгляд изнутри' } },
  rsvp:      { title: { az: 'Sizi gözləyək?', en: 'Shall we expect you?', ru: 'Вас ждать?' } },
  guestbook: { title: { az: 'Qonaq dəftəri', en: 'Guest book', ru: 'Книга гостей' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Qəhvə dəmlənib, masalar hazırdır — xoş gəlmisiniz!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The coffee is brewed, the tables are set — welcome!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Кофе сварен, столы накрыты — добро пожаловать!',
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
