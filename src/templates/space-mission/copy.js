/* space-mission — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (uşaq ad günü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Starta qədər', en: 'Countdown to launch', ru: 'До старта' } },
  venue:     { title: { az: 'Eniş nöqtəsi', en: 'Landing site', ru: 'Место посадки' } },
  program:   { title: { az: 'Uçuş planı', en: 'Flight plan', ru: 'План полёта' } },
  dresscode: { title: { az: 'Ekipaj forması', en: 'Crew uniform', ru: 'Форма экипажа' } },
  seating:   { title: { az: 'Bortdakı yeriniz', en: 'Your seat on board', ru: 'Ваше место на борту' } },
  gallery:   { title: { az: 'İlluminatorlar', en: 'Portholes', ru: 'Иллюминаторы' } },
  rsvp:      { title: { az: 'Ekipaja qoşulun', en: 'Join the crew', ru: 'Присоединяйтесь к экипажу' } },
  guestbook: { title: { az: 'Kosmosdan siqnallar', en: 'Signals from space', ru: 'Сигналы из космоса' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Missiya başlayır — kiçik kosmonavt ulduzlara uçur!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The mission begins — our little astronaut is off to the stars!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Миссия начинается — маленький космонавт летит к звёздам!',
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
