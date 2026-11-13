/* boho-sunset — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (qız gecəsi seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gün batımına qədər', en: 'Until sunset', ru: 'До заката' } },
  venue:     { title: { az: 'Harada görüşürük', en: 'Where we meet', ru: 'Где встречаемся' } },
  program:   { title: { az: 'Gecənin axışı', en: 'How the night flows', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yerin hazırdır', en: 'Your seat', ru: 'Твоё место' } },
  gallery:   { title: { az: 'Gecədən kadrlar', en: 'Frames from the night', ru: 'Кадры вечера' } },
  rsvp:      { title: { az: 'Bizimləsən?', en: 'Are you in?', ru: 'Ты с нами?' } },
  guestbook: { title: { az: 'Gəlinə arzular', en: 'Wishes for the bride', ru: 'Пожелания невесте' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Gün batır, dostlar yığışır — bu axşam sənin üçün',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The sun sets, the friends gather — tonight is for you',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Солнце садится, подруги собираются — этот вечер для тебя',
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
