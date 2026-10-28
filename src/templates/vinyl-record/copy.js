/* vinyl-record — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Plyonka başlayana qədər', en: 'Until the needle drops', ru: 'Пока не опустится игла' } },
  venue:     { title: { az: 'Səhnə', en: 'The stage', ru: 'Сцена' } },
  program:   { title: { az: 'Trek siyahısı', en: 'Tracklist', ru: 'Треклист' } },
  dresscode: { title: { az: 'Səhnə geyimi', en: 'Stage attire', ru: 'Сценический образ' } },
  seating:   { title: { az: 'Sizin masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Albom fotoları', en: 'Album photos', ru: 'Фото альбома' } },
  rsvp:      { title: { az: 'Konsertə gəlirsiniz?', en: 'Coming to the show?', ru: 'Придёте на концерт?' } },
  guestbook: { title: { az: 'Layner qeydləri', en: 'Liner notes', ru: 'Заметки на конверте' } },
}

export const TXT = {
  az: {
    label: 'Digitoy Records',
    stereo: 'STEREO',
    vu: 'VU',
    track: 'Trek',
    side: 'Tərəf',
    table: 'Masa',
  },
  en: {
    label: 'Digitoy Records',
    stereo: 'STEREO',
    vu: 'VU',
    track: 'Track',
    side: 'Side',
    table: 'Table',
  },
  ru: {
    label: 'Digitoy Records',
    stereo: 'STEREO',
    vu: 'VU',
    track: 'Трек',
    side: 'Сторона',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['label', 'hero', 'Səsyazma studiyası (yuxarı panel və alt imza)'],
  ['stereo', 'hero', '«STEREO» nişanı'],
  ['vu', 'countdown', 'VU göstəricisinin yazısı'],
  ['track', 'program', 'Proqram — «Trek» sözü'],
  ['side', 'seating', '«Tərəf» sözü'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
]
