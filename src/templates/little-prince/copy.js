/* little-prince — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (sünnət seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Böyük günə qədər', en: 'Until the big day', ru: 'До большого дня' } },
  venue:     { title: { az: 'Saray harada?', en: 'Where is the palace?', ru: 'Где дворец?' } },
  program:   { title: { az: 'Şahzadənin fərmanı', en: 'The royal decree', ru: 'Королевский указ' } },
  dresscode: { title: { az: 'Saray geyimi', en: 'Palace attire', ru: 'Дворцовый наряд' } },
  seating:   { title: { az: 'Sarayda yeriniz', en: 'Your place at court', ru: 'Ваше место при дворе' } },
  gallery:   { title: { az: 'Saray albomu', en: 'The royal album', ru: 'Королевский альбом' } },
  rsvp:      { title: { az: 'Saraya gələcəksiniz?', en: 'Will you join the court?', ru: 'Придёте ко двору?' } },
  guestbook: { title: { az: 'Şahzadəyə arzular', en: 'Wishes for the prince', ru: 'Пожелания принцу' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Bu gün sarayın şahzadəsi o, tacı isə sevginizdir',
    table: 'Masa',
    end: 'Sarayda görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Today he is the prince of the palace, your love his crown',
    table: 'Table',
    end: 'Until we meet at the palace',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Сегодня он принц дворца, а ваша любовь — его корона',
    table: 'Стол',
    end: 'До встречи во дворце',
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
