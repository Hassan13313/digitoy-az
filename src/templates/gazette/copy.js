/* gazette — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Geri sayım başladı', en: 'The countdown is on', ru: 'Обратный отсчёт начался' } },
  venue:     { title: { az: 'Hadisə yeri', en: 'Scene of the event', ru: 'Место события' } },
  program:   { title: { az: 'Axşamın proqramı', en: 'Tonight’s listings', ru: 'Программа вечера' } },
  dresscode: { title: { az: 'Moda rubrikası', en: 'Fashion column', ru: 'Модная рубрика' } },
  seating:   { title: { az: 'Elanlar: masanız', en: 'Classifieds: your table', ru: 'Объявления: ваш стол' } },
  gallery:   { title: { az: 'Foto reportaj', en: 'Photo report', ru: 'Фоторепортаж' } },
  rsvp:      { title: { az: 'Kuponu doldurun', en: 'Fill in the coupon', ru: 'Заполните купон' } },
  guestbook: { title: { az: 'Oxucu məktubları', en: 'Letters to the editor', ru: 'Письма читателей' } },
}

export const TXT = {
  az: {
    and: 'və',
    city: 'Bakı',
    lead: '{venue} — {date}. Redaksiyamıza daxil olan xəbərə görə, {names} məclisi{at} başlayacaq. Qonaqları musiqi, ziyafət və unudulmaz bir axşam gözləyir. Ətraflı məlumat növbəti səhifələrdə.',
    leadAt: 'saat {time}-da',
    price: 'Qiyməti: pulsuz',
    page: 'Səhifə',
    caption: 'Şəkil',
    weather: 'Hava proqnozu',
    forecast: 'Günəşli. Sevgi ehtimalı — 100%.',
    table: 'Masa',
    mates: 'Masa yoldaşları',
  },
  en: {
    and: 'and',
    city: 'Baku',
    lead: '{venue} — {date}. Word has reached our newsroom that the celebration of {names} will begin{at}. Guests can expect music, a banquet and an unforgettable evening. Full details on the following pages.',
    leadAt: 'at {time}',
    price: 'Price: free',
    page: 'Page',
    caption: 'Pictured',
    weather: 'Weather',
    forecast: 'Sunny. 100% chance of love.',
    table: 'Table',
    mates: 'Table companions',
  },
  ru: {
    and: 'и',
    city: 'Баку',
    lead: '{venue} — {date}. Как стало известно редакции, торжество {names} начнётся{at}. Гостей ждут музыка, банкет и незабываемый вечер. Подробности — на следующих страницах.',
    leadAt: 'в {time}',
    price: 'Цена: бесплатно',
    page: 'Стр.',
    caption: 'На снимке',
    weather: 'Прогноз погоды',
    forecast: 'Солнечно. Вероятность любви — 100%.',
    table: 'Стол',
    mates: 'Соседи по столу',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['and', 'hero', 'Adlar arasında «və»'],
  ['city', 'hero', 'Şəhər (məkan yazılmayanda)'],
  ['lead', 'hero', 'Baş məqalə', 'Avtomatik doldurulur: {venue} məkan, {date} tarix, {names} adlar, {at} saat ifadəsi (aşağıdakı sahə)'],
  ['leadAt', 'hero', 'Baş məqalə — saat ifadəsi', '{time} — tədbirin saatı; saat yazılmayıbsa bu ifadə görünmür'],
  ['price', 'hero', 'Qiymət sətri'],
  ['page', 'hero', '«Səhifə» sözü'],
  ['caption', 'hero', 'Şəkil altı («Şəkil»)'],
  ['weather', 'countdown', 'Hava proqnozu — başlıq'],
  ['forecast', 'countdown', 'Hava proqnozu — mətn'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
  ['mates', 'seating', '«Masa yoldaşları»'],
]
