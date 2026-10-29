/* fairy-tale — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Nağıla qədər', en: 'Until the tale begins', ru: 'До начала сказки' } },
  venue:     { title: { az: 'Sehrli xəritə', en: 'The magic map', ru: 'Волшебная карта' } },
  program:   { title: { az: 'Nağılın fəsilləri', en: 'Chapters of the tale', ru: 'Главы сказки' } },
  dresscode: { title: { az: 'Nağıl kostyumu', en: 'Storybook costume', ru: 'Сказочный костюм' } },
  seating:   { title: { az: 'Sehrli güzgü', en: 'The magic mirror', ru: 'Волшебное зеркало' } },
  gallery:   { title: { az: 'Portret zalı', en: 'The portrait hall', ru: 'Портретный зал' } },
  rsvp:      { title: { az: 'Nağıla gələcəksiniz?', en: 'Will you join the tale?', ru: 'Придёте в сказку?' } },
  guestbook: { title: { az: 'Sehrli arzular', en: 'Magic wishes', ru: 'Волшебные пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    once: 'Biri var idi, biri yox idi…',
    chapter: 'Fəsil',
    table: 'Masa',
    mirror: 'Güzgü, güzgü, de görüm…',
    end: '…və nağıl başlayır',
  },
  en: {
    brand: 'Digitoy',
    once: 'Once upon a time…',
    chapter: 'Chapter',
    table: 'Table',
    mirror: 'Mirror, mirror, show me…',
    end: '…and the tale begins',
  },
  ru: {
    brand: 'Digitoy',
    once: 'Жили-были…',
    chapter: 'Глава',
    table: 'Стол',
    mirror: 'Свет мой, зеркальце, скажи…',
    end: '…и сказка начинается',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['once', 'hero', 'Dizayn mətni: «Biri var idi, biri yox idi…»'],
  ['chapter', 'program', 'Dizayn mətni: «Fəsil»'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['mirror', 'seating', 'Dizayn mətni: «Güzgü, güzgü, de görüm…»'],
  ['end', 'program', 'Dizayn mətni: «…və nağıl başlayır»'],
]
