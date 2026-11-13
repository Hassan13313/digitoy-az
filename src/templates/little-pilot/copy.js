/* little-pilot — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (sünnət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Uçuşa qədər', en: 'Until take-off', ru: 'До взлёта' } },
  venue:     { title: { az: 'Eniş meydançası', en: 'Landing strip', ru: 'Посадочная площадка' } },
  program:   { title: { az: 'Uçuş marşrutu', en: 'Flight route', ru: 'Маршрут полёта' } },
  dresscode: { title: { az: 'Ekipaj forması', en: 'Crew uniform', ru: 'Форма экипажа' } },
  seating:   { title: { az: 'Bortda yeriniz', en: 'Your seat on board', ru: 'Ваше место на борту' } },
  gallery:   { title: { az: 'Pəncərədən görünənlər', en: 'Views from the window', ru: 'Вид из иллюминатора' } },
  rsvp:      { title: { az: 'Bortda olacaqsınız?', en: 'Will you be on board?', ru: 'Будете на борту?' } },
  guestbook: { title: { az: 'Pilota mesaj', en: 'Message to the pilot', ru: 'Послание пилоту' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Kəmərləri bağlayın — kiçik pilot havaya qalxır!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Fasten your seatbelts — the little pilot takes off!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Пристегните ремни — маленький пилот взлетает!',
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
