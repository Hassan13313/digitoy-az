/* disco-ball — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (qız gecəsi seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Rəqsə qədər', en: 'Until we dance', ru: 'До танцев' } },
  venue:     { title: { az: 'Rəqs meydançası', en: 'The dance floor', ru: 'Танцпол' } },
  program:   { title: { az: 'Gecənin pleylisti', en: 'Tonight’s playlist', ru: 'Плейлист вечера' } },
  dresscode: { title: { az: 'Geyim — parılda!', en: 'Dress code — shine!', ru: 'Дресс-код — сияй!' } },
  seating:   { title: { az: 'Masan burada', en: 'Your table', ru: 'Твой стол' } },
  gallery:   { title: { az: 'Disko anları', en: 'Disco moments', ru: 'Диско-моменты' } },
  rsvp:      { title: { az: 'Rəqsə gəlirsən?', en: 'Ready to dance?', ru: 'Идёшь танцевать?' } },
  guestbook: { title: { az: 'Gəlinə arzular', en: 'Wishes for the bride', ru: 'Пожелания невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Kürə fırlanır, musiqi başlayır — səhər açılana qədər rəqs!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The ball spins, the music starts — dance until sunrise!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Шар крутится, музыка звучит — танцуем до рассвета!',
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
