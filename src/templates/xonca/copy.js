/* xonca — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    table: 'Masa',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
]
