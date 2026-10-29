/* bistro-sign — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Qapılar açılana qədər', en: 'Until the doors open', ru: 'До открытия дверей' } },
  venue:     { title: { az: 'Bizi burada tapın', en: 'Find us here', ru: 'Найдите нас здесь' } },
  program:   { title: { az: 'Günün menyusu', en: 'Menu of the day', ru: 'Меню дня' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin üçün rezerv', en: 'Reserved for you', ru: 'Зарезервировано для вас' } },
  gallery:   { title: { az: 'İçəridən görüntülər', en: 'A look inside', ru: 'Взгляд изнутри' } },
  rsvp:      { title: { az: 'Sizi gözləyək?', en: 'Shall we expect you?', ru: 'Вас ждать?' } },
  guestbook: { title: { az: 'Qonaq dəftəri', en: 'Guest book', ru: 'Книга гостей' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    closed: 'Bağlı',
    open: 'Açıq',
    welcome: 'Xoş gəlmisiniz!',
    reserved: 'Rezerv',
    since: 'Açılış',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    closed: 'Closed',
    open: 'Open',
    welcome: 'Welcome!',
    reserved: 'Reserved',
    since: 'Opening',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    closed: 'Закрыто',
    open: 'Открыто',
    welcome: 'Добро пожаловать!',
    reserved: 'Резерв',
    since: 'Открытие',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['closed', 'hero', 'Dizayn mətni: «Bağlı»'],
  ['open', 'hero', 'Dizayn mətni: «Açıq»'],
  ['welcome', 'hero', 'Dizayn mətni: «Xoş gəlmisiniz!»'],
  ['reserved', 'seating', 'Dizayn mətni: «Rezerv»'],
  ['since', 'hero', 'Dizayn mətni: «Açılış»'],
]
