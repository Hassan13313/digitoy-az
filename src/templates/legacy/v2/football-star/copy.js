/* football-star — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Matça qədər', en: 'Until kick-off', ru: 'До начала матча' } },
  venue:     { title: { az: 'Stadion', en: 'The stadium', ru: 'Стадион' } },
  program:   { title: { az: 'Matçın gedişi', en: 'Match timeline', ru: 'Ход матча' } },
  dresscode: { title: { az: 'Azarkeş forması', en: 'Fan kit', ru: 'Форма болельщика' } },
  seating:   { title: { az: 'Tribunada yeriniz', en: 'Your seat in the stands', ru: 'Ваше место на трибуне' } },
  gallery:   { title: { az: 'Kolleksiya kartları', en: 'Collector cards', ru: 'Коллекционные карточки' } },
  rsvp:      { title: { az: 'Komandadasınız?', en: 'Are you in the squad?', ru: 'Вы в составе?' } },
  guestbook: { title: { az: 'Azarkeş sözləri', en: 'Words from the fans', ru: 'Слова болельщиков' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    home: 'EV',
    away: 'QONAQ',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    home: 'HOME',
    away: 'AWAY',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    home: 'ХОЗЯЕВА',
    away: 'ГОСТИ',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['home', 'countdown', 'Dizayn mətni: «EV»'],
  ['away', 'countdown', 'Dizayn mətni: «QONAQ»'],
]
