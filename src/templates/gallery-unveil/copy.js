/* gallery-unveil — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Sərgiyə qədər', en: 'Until the exhibition', ru: 'До выставки' } },
  venue:     { title: { az: 'Qalereya', en: 'The gallery', ru: 'Галерея' } },
  program:   { title: { az: 'Kataloq', en: 'Catalogue', ru: 'Каталог' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Salon', en: 'The salon', ru: 'Салон' } },
  rsvp:      { title: { az: 'Ziyarətinizi təsdiqləyin', en: 'Confirm your visit', ru: 'Подтвердите визит' } },
  guestbook: { title: { az: 'Ziyarətçi dəftəri', en: 'Visitors’ book', ru: 'Книга посетителей' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    opening: 'Sərginin açılışı',
    medium: 'Dəvətnamə, rəqəmsal',
    guest: 'Qonaq',
    no: 'No.',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    opening: 'Exhibition opening',
    medium: 'Invitation, digital',
    guest: 'Guest',
    no: 'No.',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    opening: 'Открытие выставки',
    medium: 'Приглашение, цифровое',
    guest: 'Гость',
    no: '№',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['opening', 'hero', 'Dizayn mətni: «Sərginin açılışı»'],
  ['medium', 'hero', 'Dizayn mətni: «Dəvətnamə, rəqəmsal»'],
  ['guest', 'seating', 'Dizayn mətni: «Qonaq»'],
  ['no', 'program', 'Dizayn mətni: «No.»'],
]
