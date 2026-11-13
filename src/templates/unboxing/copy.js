/* unboxing — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (açılış və təqdimat seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Təqdimata qədər', en: 'Until the reveal', ru: 'До презентации' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место' } },
  program:   { title: { az: 'Təqdimat planı', en: 'Launch agenda', ru: 'План презентации' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Giriş kartınız', en: 'Your pass', ru: 'Ваш пропуск' } },
  gallery:   { title: { az: 'Təqdimat anları', en: 'Launch moments', ru: 'Моменты презентации' } },
  rsvp:      { title: { az: 'Yerinizi təsdiqləyin', en: 'Reserve your spot', ru: 'Подтвердите место' } },
  guestbook: { title: { az: 'Rəyləriniz', en: 'Your words', ru: 'Ваши отзывы' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Qutunu birlikdə açaq — yenilik sizi gözləyir',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Let’s open the box together — something new awaits',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Откроем коробку вместе — вас ждёт новинка',
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
