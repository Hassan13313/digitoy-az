/* gender-reveal — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn (baby shower seriyası): bölmə başlıqları əvvəlki kimidir,
   TXT yalnız yeni görünüşdə işlənən sətirlərdir.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Sirr açılana qədər', en: 'Until the big reveal', ru: 'До раскрытия секрета' } },
  venue:     { title: { az: 'Sürpriz harada?', en: 'Where is the surprise?', ru: 'Где сюрприз?' } },
  program:   { title: { az: 'Günün gedişi', en: 'How the day goes', ru: 'Как пройдёт день' } },
  dresscode: { title: { az: 'Hansı komandadasınız?', en: 'Which team are you?', ru: 'Вы за какую команду?' } },
  seating:   { title: { az: 'Masanız qutuda', en: 'Your table is in the box', ru: 'Ваш стол в коробке' } },
  gallery:   { title: { az: 'Sürpriz anları', en: 'Surprise moments', ru: 'Моменты сюрприза' } },
  rsvp:      { title: { az: 'Sirrin açılışında olacaqsınız?', en: 'Will you be at the reveal?', ru: 'Будете на раскрытии?' } },
  guestbook: { title: { az: 'Təxminlər və arzular', en: 'Guesses and wishes', ru: 'Догадки и пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Mavi, yoxsa çəhrayı? Cavabı birlikdə öyrənək!',
    table: 'Masa',
    end: 'Görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Blue or pink? Let’s find out together!',
    table: 'Table',
    end: 'See you there',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Голубой или розовый? Узнаем вместе!',
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
