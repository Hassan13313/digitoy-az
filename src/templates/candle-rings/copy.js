/* candle-rings — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şamlar yanana qədər', en: 'Until the candles are lit', ru: 'До того, как зажгут свечи' } },
  venue:     { title: { az: 'Harada', en: 'Where', ru: 'Где' } },
  program:   { title: { az: 'Gecənin axışı', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'Toy fotoları', en: 'Wedding photos', ru: 'Фото со свадьбы' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Bir neçə söz yazın', en: 'Leave us a few words', ru: 'Оставьте нам пару слов' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    left: 'gün qalıb',
    rings: 'İki üzük, bir söz.',
    table: 'nömrəli masa',
    end: 'Sizi bu gecənin işığında gözləyirik',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    left: 'days to go',
    rings: 'Two rings, one promise.',
    table: 'table',
    end: 'We will be waiting for you by candlelight',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    left: 'дней осталось',
    rings: 'Два кольца, одно слово.',
    table: 'стол',
    end: 'Ждём вас при свете свечей',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Açılışdan sonra: «Aşağı sürüşdürün»'],
  ['left', 'countdown', 'Sayğacda: «gün qalıb»'],
  ['rings', 'program', 'Üzük fotosunun üstündəki sətir'],
  ['table', 'seating', 'Masa kartında: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
