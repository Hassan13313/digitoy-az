/* pink-champagne — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qız gecəsinə qədər', en: 'Until the big night', ru: 'До девичника' } },
  venue:     { title: { az: 'Harada görüşürük?', en: 'Where we meet', ru: 'Где встречаемся?' } },
  program:   { title: { az: 'Gecənin planı', en: 'The plan', ru: 'План вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yerin hazırdır', en: 'Your seat is ready', ru: 'Твоё место готово' } },
  gallery:   { title: { az: 'Qızlarla anlar', en: 'Girls’ moments', ru: 'Моменты с подругами' } },
  rsvp:      { title: { az: 'Gəlirsən?', en: 'Are you in?', ru: 'Ты с нами?' } },
  guestbook: { title: { az: 'Gəlinə arzular', en: 'Wishes for the bride', ru: 'Пожелания невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    bride: 'Gəlin olacaq',
    cheers: 'Sağlığına!',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    bride: 'Bride to be',
    cheers: 'Cheers!',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    bride: 'Скоро невеста',
    cheers: 'За невесту!',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['bride', 'hero', 'Dizayn mətni: «Gəlin olacaq»'],
  ['cheers', 'hero', 'Dizayn mətni: «Sağlığına!»'],
]
