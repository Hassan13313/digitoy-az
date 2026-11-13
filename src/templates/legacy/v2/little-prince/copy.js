/* little-prince — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Böyük günə qədər', en: 'Until the big day', ru: 'До большого дня' } },
  venue:     { title: { az: 'Saray harada?', en: 'Where is the palace?', ru: 'Где дворец?' } },
  program:   { title: { az: 'Şahzadənin fərmanı', en: 'The royal decree', ru: 'Королевский указ' } },
  dresscode: { title: { az: 'Saray geyimi', en: 'Palace attire', ru: 'Дворцовый наряд' } },
  seating:   { title: { az: 'Sarayda yeriniz', en: 'Your place at court', ru: 'Ваше место при дворе' } },
  gallery:   { title: { az: 'Saray albomu', en: 'The royal album', ru: 'Королевский альбом' } },
  rsvp:      { title: { az: 'Saraya gələcəksiniz?', en: 'Will you join the court?', ru: 'Придёте ко двору?' } },
  guestbook: { title: { az: 'Şahzadəyə arzular', en: 'Wishes for the prince', ru: 'Пожелания принцу' } },
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
