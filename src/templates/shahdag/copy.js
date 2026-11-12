/* shahdag — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qar yağana qədər', en: 'Until the snow', ru: 'До снега' } },
  venue:     { title: { az: 'Dağ evi', en: 'The chalet', ru: 'Шале' } },
  program:   { title: { az: 'Gecənin axışı', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Toy fotoları', en: 'Wedding photos', ru: 'Фото со свадьбы' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you come?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Arzularınız', en: 'Your wishes', ru: 'Ваши пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    left: 'gün qalıb',
    bouquet: 'Qar, şam işığı və iki ürək',
    warm: 'İsti geyinin: gecə dağda sərin olacaq',
    table: 'nömrəli masa',
    end: 'Dağda görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    left: 'days to go',
    bouquet: 'Snow, candlelight and two hearts',
    warm: 'Dress warm: the mountain night will be cold',
    table: 'table',
    end: 'See you in the mountains',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    left: 'дней осталось',
    bouquet: 'Снег, свечи и два сердца',
    warm: 'Одевайтесь тепло: ночью в горах прохладно',
    table: 'стол',
    end: 'До встречи в горах',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Örtükdə: «Aşağı sürüşdürün»'],
  ['left', 'countdown', 'Sayğacda: «gün qalıb»'],
  ['bouquet', 'countdown', 'Qış buketi fotosunun üstündəki sətir'],
  ['warm', 'dresscode', 'Geyim bölməsində qış qeydi'],
  ['table', 'seating', 'Masa kartında: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
