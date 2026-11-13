/* masquerade-ball — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    table: 'Masa',
    ball: 'Maskarad balı',
    guest: 'Hörmətli qonaq',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    ball: 'Masquerade ball',
    guest: 'Honoured guest',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    ball: 'Бал-маскарад',
    guest: 'Уважаемый гость',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['ball', 'hero', 'Dizayn mətni: «Maskarad balı»'],
  ['guest', 'seating', 'Dizayn mətni: «Hörmətli qonaq»'],
]
