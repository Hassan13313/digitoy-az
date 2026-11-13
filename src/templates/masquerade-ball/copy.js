/* masquerade-ball — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (bayram gecələri seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bal başlayana qədər', en: 'Until the ball begins', ru: 'До начала бала' } },
  venue:     { title: { az: 'Bal salonu', en: 'The ballroom', ru: 'Бальный зал' } },
  program:   { title: { az: 'Rəqs kartı', en: 'Dance card', ru: 'Бальная карточка' } },
  dresscode: { title: { az: 'Geyim və maska', en: 'Attire & mask', ru: 'Наряд и маска' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Maskalar arxasında', en: 'Behind the masks', ru: 'За масками' } },
  rsvp:      { title: { az: 'Bala gələcəksiniz?', en: 'Will you attend the ball?', ru: 'Придёте на бал?' } },
  guestbook: { title: { az: 'Gizli arzular', en: 'Secret wishes', ru: 'Тайные пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Maskanızı taxın — gecənin sirri sizi gözləyir',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Put on your mask — the night’s secret awaits',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Наденьте маску — тайна вечера ждёт вас',
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
