/* baku-night — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gecəyə qədər', en: 'Until the night', ru: 'До вечера' } },
  venue:     { title: { az: 'Harada', en: 'Where', ru: 'Где' } },
  program:   { title: { az: 'Gecənin axışı', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz hazırdır', en: 'Your seat is ready', ru: 'Ваше место готово' } },
  gallery:   { title: { az: 'Gecədən kadrlar', en: 'Shots from the night', ru: 'Кадры вечера' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Bir neçə söz', en: 'A few words', ru: 'Пара слов' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    lead: 'Şəhərin işıqları yananda sizi yanımızda görmək istəyirik.',
    intro: 'Bir axşam, bir şəhər və bir ömürlük söz.',
    days: 'gün',
    city: 'Bu şəhərdə başlayan hekayənin ən gözəl gecəsi',
    table: 'nömrəli masa',
    end: 'Sizi gözləyirik',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    lead: 'When the city lights come on, we want you by our side.',
    intro: 'One evening, one city and a promise for life.',
    days: 'days',
    city: 'The most beautiful night of a story that began in this city',
    table: 'table',
    end: 'We look forward to seeing you',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    lead: 'Когда зажгутся огни города, мы хотим видеть вас рядом.',
    intro: 'Один вечер, один город и слово на всю жизнь.',
    days: 'дней',
    city: 'Самый красивый вечер истории, начавшейся в этом городе',
    table: 'стол',
    end: 'Ждём вас',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['lead', 'hero', 'Örtükdə adların altındakı cümlə'],
  ['scroll', 'hero', 'Örtükdə: «Aşağı sürüşdürün»'],
  ['intro', 'countdown', 'Giriş cümləsi (sayğacdan əvvəl)'],
  ['days', 'countdown', 'Sayğacda: «gün»'],
  ['city', 'program', 'İçərişəhər fotosunun üstündəki sətir'],
  ['table', 'seating', 'Masa biletində: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
