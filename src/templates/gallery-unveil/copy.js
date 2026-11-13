/* gallery-unveil — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (açılış və təqdimat seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Sərgiyə qədər', en: 'Until the exhibition', ru: 'До выставки' } },
  venue:     { title: { az: 'Qalereya', en: 'The gallery', ru: 'Галерея' } },
  program:   { title: { az: 'Kataloq', en: 'Catalogue', ru: 'Каталог' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Salon', en: 'The salon', ru: 'Салон' } },
  rsvp:      { title: { az: 'Ziyarətinizi təsdiqləyin', en: 'Confirm your visit', ru: 'Подтвердите визит' } },
  guestbook: { title: { az: 'Ziyarətçi dəftəri', en: 'Visitors’ book', ru: 'Книга посетителей' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Pərdə qalxır — əsər sizə təqdim olunur',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The veil lifts — the work is yours to see',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Покров снят — работа представлена вам',
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
