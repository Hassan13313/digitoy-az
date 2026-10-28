/* night-sky — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
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
    moon: 'O gecə Ay {pct}% işıqlı olacaq',
    dirN: 'Şimal',
    dirE: 'Şərq',
    dirS: 'Cənub',
    dirW: 'Qərb',
  },
  en: {
    brand: 'Digitoy',
    moon: 'The moon will be {pct}% lit that night',
    dirN: 'North',
    dirE: 'East',
    dirS: 'South',
    dirW: 'West',
  },
  ru: {
    brand: 'Digitoy',
    moon: 'В ту ночь Луна будет освещена на {pct}%',
    dirN: 'Север',
    dirE: 'Восток',
    dirS: 'Юг',
    dirW: 'Запад',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['moon', 'hero', 'Ay sətri', '{pct} — Ayın işıqlı faizi (avtomatik hesablanır)'],
  ['dirN', 'hero', 'Ulduz xəritəsi — şimal'],
  ['dirE', 'hero', 'Ulduz xəritəsi — şərq'],
  ['dirS', 'hero', 'Ulduz xəritəsi — cənub'],
  ['dirW', 'hero', 'Ulduz xəritəsi — qərb'],
]
