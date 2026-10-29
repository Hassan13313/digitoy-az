/* dino-adventure — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    table: 'Masa',
    found: 'Tapıntı!',
    hello: 'Salam!',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    found: 'Found it!',
    hello: 'Hello!',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    found: 'Находка!',
    hello: 'Привет!',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['found', 'seating', 'Dizayn mətni: «Tapıntı!»'],
  ['hello', 'hero', 'Dizayn mətni: «Salam!»'],
]
