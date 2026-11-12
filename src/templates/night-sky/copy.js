/* night-sky — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'O gecəyə qədər', en: 'Until that night', ru: 'До той ночи' } },
  venue:     { title: { az: 'Göyün altındakı yer', en: 'Under this sky', ru: 'Под этим небом' } },
  program:   { title: { az: 'Axşamın bürcü', en: 'The evening’s constellation', ru: 'Созвездие вечера' } },
  dresscode: { title: { az: 'Gecə geyimi', en: 'Evening attire', ru: 'Вечерний дресс-код' } },
  seating:   { title: { az: 'Sizin ulduzunuz', en: 'Your star', ru: 'Ваша звезда' } },
  gallery:   { title: { az: 'Gecənin kadrları', en: 'Frames of the night', ru: 'Кадры ночи' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınızmı?', en: 'Will you be with us?', ru: 'Вы будете с нами?' } },
  guestbook: { title: { az: 'Ulduzlara dilək', en: 'Wishes on a star', ru: 'Желания звёздам' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Ulduzlar bu gecə bizim üçün düzülüb',
    table: 'Masa',
    end: 'Ulduzların altında görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Tonight the stars line up for us',
    table: 'Table',
    end: 'Meet us under the stars',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Сегодня звёзды сложились для нас',
    table: 'Стол',
    end: 'Встретимся под звёздами',
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
