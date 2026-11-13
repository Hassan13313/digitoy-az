/* mirror-candle — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Şamlar yanana qədər', en: 'Until the candles glow', ru: 'Пока не зажгутся свечи' } },
  venue:     { title: { az: 'İşığın yeri', en: 'Where the light gathers', ru: 'Где собирается свет' } },
  program:   { title: { az: 'Gecənin işıqları', en: 'Lights of the evening', ru: 'Огни вечера' } },
  dresscode: { title: { az: 'Güzgüyə yaraşan', en: 'Worthy of the mirror', ru: 'Достойно зеркала' } },
  seating:   { title: { az: 'Güzgüdə yeriniz', en: 'Your place in the mirror', ru: 'Ваше место в зеркале' } },
  gallery:   { title: { az: 'Əks olunan anlar', en: 'Reflected moments', ru: 'Отражённые мгновения' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you be there?', ru: 'Вы будете?' } },
  guestbook: { title: { az: 'İşıqlı arzular', en: 'Bright wishes', ru: 'Светлые пожелания' } },
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
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
]
