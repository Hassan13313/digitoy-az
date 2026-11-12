/* cinema-premiere — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Seansa qalıb', en: 'Until showtime', ru: 'До сеанса' } },
  venue:     { title: { az: 'Kinoteatr', en: 'The theatre', ru: 'Кинотеатр' } },
  program:   { title: { az: 'Seanslar', en: 'Showtimes', ru: 'Сеансы' } },
  dresscode: { title: { az: 'Qırmızı xalça', en: 'Red carpet', ru: 'Красная дорожка' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Stills', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Biletinizi təsdiqləyin', en: 'Confirm your ticket', ru: 'Подтвердите билет' } },
  guestbook: { title: { az: 'Tamaşaçı rəyləri', en: 'Audience reviews', ru: 'Отзывы зрителей' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Premyera yalnız bir gecəlikdir',
    table: 'Masa',
    end: 'Qırmızı xalçada görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'The premiere is for one night only',
    table: 'Table',
    end: 'See you on the red carpet',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Премьера — только один вечер',
    table: 'Стол',
    end: 'До встречи на красной дорожке',
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
