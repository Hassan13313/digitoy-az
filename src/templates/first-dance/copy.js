/* first-dance — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'İlk rəqsə qədər', en: 'Until the first dance', ru: 'До первого танца' } },
  venue:     { title: { az: 'Rəqs meydançası', en: 'The dance floor', ru: 'Где танцуем' } },
  program:   { title: { az: 'Gecənin musiqisi', en: 'Tonight’s running order', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Gecədən kadrlar', en: 'Shots from the night', ru: 'Кадры вечера' } },
  rsvp:      { title: { az: 'Rəqsə gəlirsiniz?', en: 'Joining the dance?', ru: 'Придёте на танец?' } },
  guestbook: { title: { az: 'Arzularınız', en: 'Your wishes', ru: 'Ваши пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    left: 'gün qalıb',
    dance: 'Bir mahnı, iki ürək, ilk rəqs.',
    table: 'nömrəli masa',
    end: 'Rəqs meydançasında görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    left: 'days to go',
    dance: 'One song, two hearts, a first dance.',
    table: 'table',
    end: 'See you on the dance floor',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    left: 'дней осталось',
    dance: 'Одна песня, два сердца, первый танец.',
    table: 'стол',
    end: 'До встречи на танцполе',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Açılışdan sonra: «Aşağı sürüşdürün»'],
  ['left', 'countdown', 'Sayğacda: «gün qalıb»'],
  ['dance', 'program', 'Rəqs fotosunun üstündəki sətir'],
  ['table', 'seating', 'Masa kartında: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
