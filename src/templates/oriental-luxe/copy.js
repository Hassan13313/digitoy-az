/* oriental-luxe — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Xoş saata qədər', en: 'Until the happy hour', ru: 'До счастливого часа' } },
  venue:     { title: { az: 'Məclisin ünvanı', en: 'Where we gather', ru: 'Где мы соберёмся' } },
  program:   { title: { az: 'Məclisin gedişi', en: 'Order of the feast', ru: 'Ход торжества' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Süfrədəki yeriniz', en: 'Your place at the table', ru: 'Ваше место за столом' } },
  gallery:   { title: { az: 'Xatirə albomu', en: 'Album of memories', ru: 'Альбом воспоминаний' } },
  rsvp:      { title: { az: 'Məclisimizə gələcəksinizmi?', en: 'Will you join our feast?', ru: 'Придёте на наше торжество?' } },
  guestbook: { title: { az: 'Xeyir-dualar', en: 'Blessings', ru: 'Благопожелания' } },
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
