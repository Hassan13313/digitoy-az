/* mashallah — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (sünnət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Toya qədər', en: 'Until the celebration', ru: 'До праздника' } },
  venue:     { title: { az: 'Toy harada?', en: 'Where is the party?', ru: 'Где праздник?' } },
  program:   { title: { az: 'Toyun axarı', en: 'How the day flows', ru: 'Как пройдёт день' } },
  dresscode: { title: { az: 'Geyim', en: 'What to wear', ru: 'Что надеть' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Göz dəyməsin anlar', en: 'Moments to treasure', ru: 'Мгновения на память' } },
  rsvp:      { title: { az: 'Toya gələcəksiniz?', en: 'Will you celebrate with us?', ru: 'Будете праздновать с нами?' } },
  guestbook: { title: { az: 'Xeyir-dua və arzular', en: 'Blessings and wishes', ru: 'Благословения и пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Maşallah! Göz dəyməsin, ömrü uzun olsun',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Mashallah! May he be blessed with a long life',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Машаллах! Пусть его жизнь будет долгой',
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
