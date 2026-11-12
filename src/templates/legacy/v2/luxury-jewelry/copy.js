/* luxury-jewelry — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Təqdimata qədər', en: 'Until the unveiling', ru: 'До презентации' } },
  venue:     { title: { az: 'Butik', en: 'The maison', ru: 'Бутик' } },
  program:   { title: { az: 'Axşamın kataloqu', en: 'Catalogue of the evening', ru: 'Каталог вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin vitrininiz', en: 'Your showcase', ru: 'Ваша витрина' } },
  gallery:   { title: { az: 'Kolleksiya', en: 'The collection', ru: 'Коллекция' } },
  rsvp:      { title: { az: 'Görüşünüzü təsdiqləyin', en: 'Confirm your appointment', ru: 'Подтвердите визит' } },
  guestbook: { title: { az: 'Hədiyyə kartları', en: 'Gift cards', ru: 'Подарочные открытки' } },
}

export const TXT = {
  az: {
    brand: 'DIGITOY',
    collection: 'Kolleksiya',
    lot: 'Lot',
    table: 'Masa',
  },
  en: {
    brand: 'DIGITOY',
    collection: 'Collection',
    lot: 'Lot',
    table: 'Table',
  },
  ru: {
    brand: 'DIGITOY',
    collection: 'Коллекция',
    lot: 'Лот',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['collection', 'hero', '«Kolleksiya» sətri (ilin qarşısında)'],
  ['lot', 'program', 'Proqram — «Lot» sözü'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
]
