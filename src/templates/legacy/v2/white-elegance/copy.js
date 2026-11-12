/* white-elegance — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Günləri sayırıq', en: 'Counting the days', ru: 'Считаем дни' } },
  venue:     { title: { az: 'Məkan', en: 'The venue', ru: 'Место' } },
  program:   { title: { az: 'Axşamın sırası', en: 'Order of the evening', ru: 'Порядок вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yer kartınız', en: 'Your place card', ru: 'Ваша карточка' } },
  gallery:   { title: { az: 'Xatirə albomu', en: 'Keepsake album', ru: 'Альбом на память' } },
  guestbook: { title: { az: 'Xoş sözlər', en: 'Kind words', ru: 'Добрые слова' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
  },
  en: {
    brand: 'Digitoy',
  },
  ru: {
    brand: 'Digitoy',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
]
