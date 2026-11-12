/* bridal-veil — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'O gün', en: 'The day', ru: 'Тот самый день' } },
  venue:     { title: { az: 'Harada', en: 'Where', ru: 'Где' } },
  program:   { title: { az: 'Toy günü', en: 'The wedding day', ru: 'День свадьбы' } },
  dresscode: { title: { az: 'Geyim tərzi', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz hazırdır', en: 'Your seat is ready', ru: 'Ваше место готово' } },
  gallery:   { title: { az: 'Toy fotoları', en: 'Wedding photos', ru: 'Фото со свадьбы' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınız?', en: 'Will you be with us?', ru: 'Будете с нами?' } },
  guestbook: { title: { az: 'Gəlinə və bəyə arzular', en: 'Wishes for the couple', ru: 'Пожелания молодым' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    bouquet: 'Ağ güllər, ağ duvaq və bir ömürlük «hə».',
    left: 'gün qalıb',
    table: 'nömrəli masa',
    end: 'Ən gözəl günümüzdə yanımızda olun',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    bouquet: 'White roses, a white veil and a lifelong “yes”.',
    left: 'days to go',
    table: 'table',
    end: 'Be with us on our most beautiful day',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    bouquet: 'Белые розы, белая фата и «да» на всю жизнь.',
    left: 'дней осталось',
    table: 'стол',
    end: 'Будьте с нами в самый красивый день',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Açılışdan sonra: «Aşağı sürüşdürün»'],
  ['bouquet', 'countdown', 'Gəlin buketi fotosunun üstündəki sətir'],
  ['left', 'countdown', 'Sayğacda: «gün qalıb»'],
  ['table', 'seating', 'Masa kartında: «nömrəli masa»'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
