/* hero-comic — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (sünnət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Böyük macəraya qədər', en: 'Until the big adventure', ru: 'До большого приключения' } },
  venue:     { title: { az: 'Qərargah', en: 'Headquarters', ru: 'Штаб-квартира' } },
  program:   { title: { az: 'Günün süjeti', en: 'Today’s storyline', ru: 'Сюжет дня' } },
  dresscode: { title: { az: 'Qəhrəman kostyumu', en: 'Hero costume', ru: 'Костюм героя' } },
  seating:   { title: { az: 'Sizin missiyanız', en: 'Your mission', ru: 'Ваша миссия' } },
  gallery:   { title: { az: 'Kadr-kadr', en: 'Frame by frame', ru: 'Кадр за кадром' } },
  rsvp:      { title: { az: 'Komandaya qoşulursunuz?', en: 'Joining the team?', ru: 'Присоединитесь к команде?' } },
  guestbook: { title: { az: 'Qəhrəmana mesaj', en: 'Message to the hero', ru: 'Послание герою' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Hər qəhrəmanın böyük günü olur — bu gün onundur',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Every hero has a big day — today is his',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'У каждого героя есть свой день — сегодня его',
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
