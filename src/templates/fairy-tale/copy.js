/* fairy-tale — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (uşaq ad günü seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
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
    line: 'Biri var idi, biri yox idi — bu gün nağılın qəhrəmanı odur',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Once upon a time — today the story is all about them',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Жили-были… и сегодня сказка о нём',
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
