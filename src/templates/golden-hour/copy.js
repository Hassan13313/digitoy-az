/* golden-hour — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Gün batana qədər', en: 'Until sunset', ru: 'До заката' } },
  venue:     { title: { az: 'Bağ harada', en: 'Where the garden is', ru: 'Где сад' } },
  program:   { title: { az: 'Axşamın axışı', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Toy fotoları', en: 'Wedding photos', ru: 'Фото со свадьбы' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you be with us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Arzularınız', en: 'Your wishes', ru: 'Ваши пожелания' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    left: 'gün qalıb',
    bouquet: 'Gün batanda «hə» deyəcəyik',
    table: 'nömrəli masa',
    end: 'Qızıl saatda görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    left: 'days to go',
    bouquet: 'We will say “yes” as the sun sets',
    table: 'table',
    end: 'See you at golden hour',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    left: 'дней осталось',
    bouquet: 'Мы скажем «да» на закате',
    table: 'стол',
    end: 'До встречи в золотой час',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Örtükdə: «Aşağı sürüşdürün»'],
  ['left', 'countdown', 'Sayğacda: «gün qalıb»'],
  ['bouquet', 'countdown', 'Buket fotosunun üstündəki sətir'],
  ['table', 'seating', 'Masa kartında: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
