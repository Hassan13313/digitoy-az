/* gender-reveal — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    question: 'Oğlan, yoxsa qız?',
    boy: 'Oğlan',
    girl: 'Qız',
    table: 'Masa',
  },
  en: {
    question: 'Boy or girl?',
    boy: 'Boy',
    girl: 'Girl',
    table: 'Table',
  },
  ru: {
    question: 'Мальчик или девочка?',
    boy: 'Мальчик',
    girl: 'Девочка',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['question', 'hero', 'Sual'],
  ['boy', 'hero', '«Oğlan» tərəfi'],
  ['girl', 'hero', '«Qız» tərəfi'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
]
