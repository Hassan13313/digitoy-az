/* royal-gold — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   2026-11 foto redizayn: köhnə dizaynın sətirləri (bilet sahələri, rubrikalar…)
   yeni görünüşdə yoxdur — burada yalnız işlənən sətirlər qalıb.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

/* Royal Gold və Floral Garden defolt bölmə adlarını saxlayır (bax tests/section_labels_test.mjs) */
export const LABELS = {}

export const TXT = {
  az: {
    brand: 'Digitoy',
    line: 'Qızıl kimi əbədi',
    table: 'Masa',
    end: 'Qızıl gecədə görüşənədək',
    scroll: 'Aşağı sürüşdürün',
  },
  en: {
    brand: 'Digitoy',
    line: 'Timeless as gold',
    table: 'Table',
    end: 'Until our golden night',
    scroll: 'Scroll down',
  },
  ru: {
    brand: 'Digitoy',
    line: 'Вечно, как золото',
    table: 'Стол',
    end: 'До встречи в золотой вечер',
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
