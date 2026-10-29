/* boho-sunset — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gün batımına qədər', en: 'Until sunset', ru: 'До заката' } },
  venue:     { title: { az: 'Harada görüşürük', en: 'Where we meet', ru: 'Где встречаемся' } },
  program:   { title: { az: 'Gecənin axışı', en: 'How the night flows', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yerin hazırdır', en: 'Your seat', ru: 'Твоё место' } },
  gallery:   { title: { az: 'Gecədən kadrlar', en: 'Frames from the night', ru: 'Кадры вечера' } },
  rsvp:      { title: { az: 'Bizimləsən?', en: 'Are you in?', ru: 'Ты с нами?' } },
  guestbook: { title: { az: 'Gəlinə arzular', en: 'Wishes for the bride', ru: 'Пожелания невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    begins: 'gecə başlayır…',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    begins: 'the night begins…',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    begins: 'ночь начинается…',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['begins', 'hero', 'Dizayn mətni: «gecə başlayır…»'],
]
