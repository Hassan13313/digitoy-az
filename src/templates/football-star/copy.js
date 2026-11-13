/* football-star — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (sünnət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
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
    line: 'Bu matçın ulduzu bəllidir — gəlin, birlikdə alqışlayaq!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The star of this match is clear — come cheer with us!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Звезда этого матча известна — приходите болеть вместе!',
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
