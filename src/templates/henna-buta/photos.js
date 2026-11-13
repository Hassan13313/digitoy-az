/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/hb-1.webp', label: 'Açılış və örtük — xınalı ovuclar', hint: 'Açılışda mandala şəklin üstündə çəkilir; öz şəklinizi qoysanız da mandala qalır.' },
  { key: 'detail', src: '/img/wedding/viral/hb-2.webp', label: 'Foto bloku — xına qabı və buta (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/hb-3.webp', label: 'Proqramın üstündəki şəkil — həyətdə süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/hb-4.webp', label: 'Final — xınalı əllərdə şam', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
