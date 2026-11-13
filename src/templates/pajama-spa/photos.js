/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ps-1.webp', label: 'Açılış və örtük — yastıqlı rahat yataq otağı', hint: 'Açılışda yastıq şəklin üstündə partlayır.' },
  { key: 'detail', src: '/img/wedding/viral/ps-2.webp', label: 'Foto bloku — spa dəsti və şamlar (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ps-3.webp', label: 'Proqramın üstündəki şəkil — gecə qəlyanaltıları', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/ps-4.webp', label: 'Final — yastıq davasından sonra lələklər', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
