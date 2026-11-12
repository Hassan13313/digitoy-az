/* crystal-glass — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'İşıqlar yanana qədər', en: 'Until the lights come on', ru: 'Пока не зажгутся огни' } },
  venue:     { title: { az: 'Salon', en: 'The hall', ru: 'Зал' } },
  program:   { title: { az: 'Axşamın spektri', en: 'Spectrum of the evening', ru: 'Спектр вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Əks olunanlar', en: 'Reflections', ru: 'Отражения' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınızmı?', en: 'Will you be with us?', ru: 'Вы будете с нами?' } },
  guestbook: { title: { az: 'Arzular', en: 'Wishes', ru: 'Пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Hər işıq bir arzu kimi parlayır',
    table: 'Masa',
    end: 'İşıqlı gecədə görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Every light shines like a wish',
    table: 'Table',
    end: 'See you on a night full of light',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Каждый огонёк сияет, как желание',
    table: 'Стол',
    end: 'Встретимся в сияющий вечер',
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
