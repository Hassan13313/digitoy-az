/* boarding-pass — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Uçuşa qalıb', en: 'Time to departure', ru: 'До вылета' } },
  venue:     { title: { az: 'Təyinat', en: 'Destination', ru: 'Пункт назначения' } },
  program:   { title: { az: 'Uçuş planı', en: 'Flight plan', ru: 'План полёта' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Səyahət albomu', en: 'Travel album', ru: 'Альбом путешествия' } },
  rsvp:      { title: { az: 'Check-in', en: 'Check-in', ru: 'Регистрация' } },
  guestbook: { title: { az: 'Hava poçtu', en: 'Air mail', ru: 'Авиапочта' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bayram səfərinə xoş gəlmisiniz',
    table: 'Masa',
    end: 'Bortda görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Welcome aboard the celebration',
    table: 'Table',
    end: 'See you on board',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Добро пожаловать на борт праздника',
    table: 'Стол',
    end: 'До встречи на борту',
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
