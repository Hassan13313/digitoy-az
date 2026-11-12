/* gazette — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Geri sayım başladı', en: 'The countdown is on', ru: 'Обратный отсчёт начался' } },
  venue:     { title: { az: 'Hadisə yeri', en: 'Scene of the event', ru: 'Место события' } },
  program:   { title: { az: 'Axşamın proqramı', en: 'Tonight’s listings', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Moda rubrikası', en: 'Fashion column', ru: 'Модная рубрика' } },
  seating:   { title: { az: 'Elanlar: masanız', en: 'Classifieds: your table', ru: 'Объявления: ваш стол' } },
  gallery:   { title: { az: 'Foto reportaj', en: 'Photo report', ru: 'Фоторепортаж' } },
  rsvp:      { title: { az: 'Kuponu doldurun', en: 'Fill in the coupon', ru: 'Заполните купон' } },
  guestbook: { title: { az: 'Oxucu məktubları', en: 'Letters to the editor', ru: 'Письма читателей' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bu xəbəri ilk siz eşidirsiniz',
    table: 'Masa',
    end: 'Növbəti buraxılışa qədər',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'You are the first to hear the news',
    table: 'Table',
    end: 'Until the next edition',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Вы первыми узнаёте эту новость',
    table: 'Стол',
    end: 'До следующего выпуска',
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
