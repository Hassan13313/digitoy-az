/* boarding-pass — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Uçuşa qalıb', en: 'Time to departure', ru: 'До вылета' } },
  venue:     { title: { az: 'Təyinat', en: 'Destination', ru: 'Пункт назначения' } },
  program:   { title: { az: 'Uçuş planı', en: 'Flight plan', ru: 'План полёта' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Səyahət albomu', en: 'Travel album', ru: 'Альбом путешествия' } },
  rsvp:      { title: { az: 'Check-in', en: 'Check-in', ru: 'Регистрация' } },
  guestbook: { title: { az: 'Hava poçtu', en: 'Air mail', ru: 'Авиапочта' } },
}

export const TXT = {
  az: {
    airline: 'DIGITOY AIR',
    cls: 'Birinci sinif',
    pax: 'Sərnişinlər',
    paxOne: 'Sərnişin',
    code: 'GYD',
    from: 'Bakı',
    flight: 'Uçuş',
    date: 'Tarix',
    boarding: 'Minmə',
    gate: 'Qapı',
    gateNo: 'VIP',
    place: 'Məkan',
    status: 'Vaxtında',
    table: 'Masa',
    parAvion: 'PAR AVION',
  },
  en: {
    airline: 'DIGITOY AIR',
    cls: 'First class',
    pax: 'Passengers',
    paxOne: 'Passenger',
    code: 'GYD',
    from: 'Baku',
    flight: 'Flight',
    date: 'Date',
    boarding: 'Boarding',
    gate: 'Gate',
    gateNo: 'VIP',
    place: 'Venue',
    status: 'On time',
    table: 'Table',
    parAvion: 'PAR AVION',
  },
  ru: {
    airline: 'DIGITOY AIR',
    cls: 'Первый класс',
    pax: 'Пассажиры',
    paxOne: 'Пассажир',
    code: 'GYD',
    from: 'Баку',
    flight: 'Рейс',
    date: 'Дата',
    boarding: 'Посадка',
    gate: 'Выход',
    gateNo: 'VIP',
    place: 'Место',
    status: 'По расписанию',
    table: 'Стол',
    parAvion: 'PAR AVION',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['airline', 'hero', 'Aviaşirkət (bilet başlığı)'],
  ['cls', 'hero', 'Bilet — sinif'],
  ['pax', 'hero', 'Bilet — «Sərnişinlər» (cütlük)'],
  ['paxOne', 'hero', 'Bilet — «Sərnişin» (tək)'],
  ['code', 'hero', 'Hava limanı kodu'],
  ['from', 'hero', 'Uçuş şəhəri'],
  ['flight', 'hero', 'Bilet — «Uçuş»'],
  ['date', 'hero', 'Bilet — «Tarix»'],
  ['boarding', 'hero', 'Bilet — «Minmə»'],
  ['gate', 'hero', 'Bilet — «Qapı»'],
  ['gateNo', 'hero', 'Qapının adı (açılışda və biletdə)'],
  ['place', 'hero', 'Bilet — «Məkan»'],
  ['status', 'program', 'Uçuş statusu'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
  ['parAvion', 'guestbook', 'Məktub möhürü'],
]
