/* hero-comic — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Böyük macəraya qədər', en: 'Until the big adventure', ru: 'До большого приключения' } },
  venue:     { title: { az: 'Qərargah', en: 'Headquarters', ru: 'Штаб-квартира' } },
  program:   { title: { az: 'Günün süjeti', en: 'Today’s storyline', ru: 'Сюжет дня' } },
  dresscode: { title: { az: 'Qəhrəman kostyumu', en: 'Hero costume', ru: 'Костюм героя' } },
  seating:   { title: { az: 'Sizin missiyanız', en: 'Your mission', ru: 'Ваша миссия' } },
  gallery:   { title: { az: 'Kadr-kadr', en: 'Frame by frame', ru: 'Кадр за кадром' } },
  rsvp:      { title: { az: 'Komandaya qoşulursunuz?', en: 'Joining the team?', ru: 'Присоединитесь к команде?' } },
  guestbook: { title: { az: 'Qəhrəmana mesaj', en: 'Message to the hero', ru: 'Послание герою' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    table: 'Masa',
    mission: 'Missiya',
  },
  en: {
    brand: 'Digitoy',
    table: 'Table',
    mission: 'Mission',
  },
  ru: {
    brand: 'Digitoy',
    table: 'Стол',
    mission: 'Миссия',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['table', 'seating', 'Dizayn mətni: «Masa»'],
  ['mission', 'venue', 'Dizayn mətni: «Missiya»'],
]
