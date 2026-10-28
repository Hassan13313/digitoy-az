/* cinema-premiere — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    studio: 'DIGITOY PICTURES',
    presents: 'təqdim edir',
    star: 'Baş rollarda {names}',
    rest1: 'Ssenari: Sevgi',
    rest2: 'Rejissor: Tale',
    rest3: 'Musiqi: Ürək döyüntüsü',
    premiere: 'Premyera',
    admit: 'Bir nəfərlik',
    table: 'Masa',
  },
  en: {
    studio: 'DIGITOY PICTURES',
    presents: 'presents',
    star: 'Starring {names}',
    rest1: 'Written by Love',
    rest2: 'Directed by Fate',
    rest3: 'Music by Heartbeat',
    premiere: 'Premiere',
    admit: 'Admit one',
    table: 'Table',
  },
  ru: {
    studio: 'DIGITOY PICTURES',
    presents: 'представляет',
    star: 'В главных ролях {names}',
    rest1: 'Сценарий: Любовь',
    rest2: 'Режиссёр: Судьба',
    rest3: 'Музыка: Сердцебиение',
    premiere: 'Премьера',
    admit: 'Входной билет',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['studio', 'hero', 'Kinostudiya'],
  ['presents', 'hero', '«təqdim edir»'],
  ['star', 'hero', 'Titr — baş rollar', '{names} — adlar (avtomatik)'],
  ['rest1', 'hero', 'Titr — ssenari'],
  ['rest2', 'hero', 'Titr — rejissor'],
  ['rest3', 'hero', 'Titr — musiqi'],
  ['premiere', 'hero', 'Titr — «Premyera»'],
  ['admit', 'seating', 'Bilet — «Bir nəfərlik»'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
]
