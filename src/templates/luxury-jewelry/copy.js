/* luxury-jewelry — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
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
    brand: 'Digitoy',
    line: 'Ən qiymətli daş — bu gün',
    table: 'Masa',
    end: 'Parıltılı gecədə görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The rarest stone is this day',
    table: 'Table',
    end: 'See you on a sparkling night',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Самый драгоценный камень — этот день',
    table: 'Стол',
    end: 'До встречи в сверкающий вечер',
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
