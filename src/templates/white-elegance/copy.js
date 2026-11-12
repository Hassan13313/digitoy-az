/* white-elegance — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Günləri sayırıq', en: 'Counting the days', ru: 'Считаем дни' } },
  venue:     { title: { az: 'Məkan', en: 'The venue', ru: 'Место' } },
  program:   { title: { az: 'Axşamın sırası', en: 'Order of the evening', ru: 'Порядок вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yer kartınız', en: 'Your place card', ru: 'Ваша карточка' } },
  gallery:   { title: { az: 'Xatirə albomu', en: 'Keepsake album', ru: 'Альбом на память' } },
  guestbook: { title: { az: 'Xoş sözlər', en: 'Kind words', ru: 'Добрые слова' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Sadəlik — ən incə lüksdür',
    table: 'Masa',
    end: 'Sizi gözləyirik',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Simplicity is the finest luxury',
    table: 'Table',
    end: 'We look forward to seeing you',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Простота — самая изысканная роскошь',
    table: 'Стол',
    end: 'Ждём вас',
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
