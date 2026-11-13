/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ms-1.webp', label: 'Açılış və örtük — atlas lentli kiçik bəy', hint: 'Açılışda şəkil göz muncuğunun ortasından görünür; öz şəklinizi qoysanız da muncuq qalır.' },
  { key: 'detail', src: '/img/wedding/viral/ms-2.webp', label: 'Foto bloku — göz muncuqları və lent (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ms-3.webp', label: 'Proqramın üstündəki şəkil — kobalt süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/ms-4.webp', label: 'Final — muncuqlu ağac', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
