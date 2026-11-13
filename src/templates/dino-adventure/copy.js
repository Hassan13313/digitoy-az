/* dino-adventure — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (uşaq ad günü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Ekspedisiyaya qədər', en: 'Until the expedition', ru: 'До экспедиции' } },
  venue:     { title: { az: 'Ekspedisiya xəritəsi', en: 'Expedition map', ru: 'Карта экспедиции' } },
  program:   { title: { az: 'İz cığırı', en: 'The footprint trail', ru: 'Тропа следов' } },
  dresscode: { title: { az: 'Kəşfiyyatçı geyimi', en: 'Explorer outfit', ru: 'Наряд исследователя' } },
  seating:   { title: { az: 'Qazıntı sahəsi', en: 'The dig site', ru: 'Место раскопок' } },
  gallery:   { title: { az: 'Kəhrəba kolleksiyası', en: 'The amber collection', ru: 'Янтарная коллекция' } },
  rsvp:      { title: { az: 'Ekspedisiyaya qoşulun', en: 'Join the expedition', ru: 'Присоединяйтесь к экспедиции' } },
  guestbook: { title: { az: 'Qaya yazıları', en: 'Cave wall wishes', ru: 'Наскальные пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Ekspedisiya başlayır — izləri izləyin!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The expedition begins — follow the footprints!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Экспедиция начинается — идите по следам!',
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
