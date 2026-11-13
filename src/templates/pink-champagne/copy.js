/* pink-champagne — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (qız gecəsi seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
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
    line: 'Bir badə gülüş, bir badə xatirə — qızlar gecəsinə xoş gəldin!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'A glass of laughter, a glass of memories — welcome to girls’ night!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Бокал смеха, бокал воспоминаний — добро пожаловать на девичник!',
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
