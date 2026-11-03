/* mashallah — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    sash: 'Maşallah',
    brand: 'Digitoy',
    table: 'Masa',
  },
  en: {
    sash: 'Mashallah',
    brand: 'Digitoy',
    table: 'Table',
  },
  ru: {
    sash: 'Машаллах',
    brand: 'Digitoy',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['sash', 'hero', 'Lentin yazısı'],
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
]
