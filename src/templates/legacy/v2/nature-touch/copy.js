/* nature-touch — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Görüşə qədər', en: 'Until we meet', ru: 'До встречи' } },
  venue:     { title: { az: 'Bizi burada tapın', en: 'Find us here', ru: 'Найдите нас здесь' } },
  program:   { title: { az: 'Cığır boyunca', en: 'Along the trail', ru: 'По тропинке' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Anlar', en: 'Moments', ru: 'Мгновения' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınızmı?', en: 'Will you join us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Xoş sözlər', en: 'Kind words', ru: 'Тёплые слова' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
]
