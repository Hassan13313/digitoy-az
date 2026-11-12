/* vinyl-record — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
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
    brand: 'Digitoy',
    line: 'Bu gecənin musiqisi bizimdir',
    table: 'Masa',
    end: 'Rəqs meydançasında görüşək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Tonight the music is ours',
    table: 'Table',
    end: 'See you on the dance floor',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Музыка этого вечера — наша',
    table: 'Стол',
    end: 'Встретимся на танцполе',
    scroll: 'Листайте вниз',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['scroll', 'hero', 'Örtükdə «Aşağı sürüşdürün»'],
  ['line', 'countdown', 'Foto blokundakı sətir (sayğacdan sonra)'],
  ['table', 'seating', 'Masa kartındakı yazı'],
  ['end', 'guestbook', 'Son kadrdakı sətir'],
]
