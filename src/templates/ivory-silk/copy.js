/* ivory-silk — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Bu günə qədər', en: 'Until the day', ru: 'До этого дня' } },
  venue:     { title: { az: 'Harada', en: 'Where', ru: 'Где' } },
  program:   { title: { az: 'Gecənin axışı', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Toy fotoları', en: 'Wedding photos', ru: 'Фото со свадьбы' } },
  rsvp:      { title: { az: 'Gələcəksiniz?', en: 'Will you join us?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Arzularınız', en: 'Your wishes', ru: 'Ваши пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    left: 'gün qalıb',
    gown: 'Hər detal o gün üçündür',
    table: 'nömrəli masa',
    end: 'Sizi gözləyirik',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    left: 'days to go',
    gown: 'Every detail is for that day',
    table: 'table',
    end: 'We look forward to seeing you',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    left: 'дней осталось',
    gown: 'Каждая деталь — для того дня',
    table: 'стол',
    end: 'Ждём вас',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Örtükdə: «Aşağı sürüşdürün»'],
  ['left', 'countdown', 'Sayğacda: «gün qalıb»'],
  ['gown', 'countdown', 'Gəlinlik fotosunun üstündəki sətir'],
  ['table', 'seating', 'Yer kartında: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
