/* space-mission — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Starta qədər', en: 'Countdown to launch', ru: 'До старта' } },
  venue:     { title: { az: 'Eniş nöqtəsi', en: 'Landing site', ru: 'Место посадки' } },
  program:   { title: { az: 'Uçuş planı', en: 'Flight plan', ru: 'План полёта' } },
  dresscode: { title: { az: 'Ekipaj forması', en: 'Crew uniform', ru: 'Форма экипажа' } },
  seating:   { title: { az: 'Bortdakı yeriniz', en: 'Your seat on board', ru: 'Ваше место на борту' } },
  gallery:   { title: { az: 'İlluminatorlar', en: 'Portholes', ru: 'Иллюминаторы' } },
  rsvp:      { title: { az: 'Ekipaja qoşulun', en: 'Join the crew', ru: 'Присоединяйтесь к экипажу' } },
  guestbook: { title: { az: 'Kosmosdan siqnallar', en: 'Signals from space', ru: 'Сигналы из космоса' } },
}

export const TXT = {
  az: {
    brand: 'DIGITOY',
    table: 'Masa',
    crew: 'EKİPAJ ÜZVÜ',
    mission: 'MİSSİYA',
    signal: 'SİQNAL',
    date: 'Tarix',
    time: 'Saat',
    place: 'Məkan',
    status: 'Bütün sistemlər hazırdır',
  },
  en: {
    brand: 'DIGITOY',
    table: 'Table',
    crew: 'CREW MEMBER',
    mission: 'MISSION',
    signal: 'SIGNAL',
    date: 'Date',
    time: 'Time',
    place: 'Venue',
    status: 'All systems go',
  },
  ru: {
    brand: 'DIGITOY',
    table: 'Стол',
    crew: 'ЧЛЕН ЭКИПАЖА',
    mission: 'МИССИЯ',
    signal: 'СИГНАЛ',
    date: 'Дата',
    time: 'Время',
    place: 'Место',
    status: 'Все системы готовы',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['crew', 'seating', 'Dizayn mətni: «EKİPAJ ÜZVÜ»'],
  ['mission', 'hero', 'Dizayn mətni: «MİSSİYA»'],
  ['signal', 'guestbook', 'Dizayn mətni: «SİQNAL»'],
  ['date', 'hero', 'Dizayn mətni: «Tarix»'],
  ['time', 'hero', 'Dizayn mətni: «Saat»'],
  ['place', 'hero', 'Dizayn mətni: «Məkan»'],
  ['status', 'countdown', 'Dizayn mətni: «Bütün sistemlər hazırdır»'],
]
