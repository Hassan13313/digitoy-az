/* mediterranean — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Yaya qədər', en: 'Until summer comes', ru: 'До нашего лета' } },
  venue:     { title: { az: 'Villa', en: 'The villa', ru: 'Вилла' } },
  program:   { title: { az: 'Gün batana qədər', en: 'Until sunset', ru: 'До заката' } },
  dresscode: { title: { az: 'Yay geyimi', en: 'Summer attire', ru: 'Летний дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Sahildən kartlar', en: 'Postcards from the coast', ru: 'Открытки с побережья' } },
  rsvp:      { title: { az: 'Cavab kartı', en: 'Reply postcard', ru: 'Открытка-ответ' } },
  guestbook: { title: { az: 'Dənizdən məktublar', en: 'Letters by the sea', ru: 'Письма у моря' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Günəş, dəniz və limon ətri',
    table: 'Masa',
    end: 'Dəniz kənarında görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Sun, sea and the scent of lemons',
    table: 'Table',
    end: 'Until we meet by the sea',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Солнце, море и аромат лимонов',
    table: 'Стол',
    end: 'До встречи у моря',
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
