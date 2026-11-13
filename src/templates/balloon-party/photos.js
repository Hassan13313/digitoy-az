/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/bl-1.webp', label: 'Açılış və örtük — pastel şar dəstəsi', hint: 'Açılışda şarlar şəklin üstündən uçub gedir.' },
  { key: 'detail', src: '/img/wedding/viral/bl-2.webp', label: 'Foto bloku — qatlı tort (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/bl-3.webp', label: 'Proqramın üstündəki şəkil — pastel süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/bl-4.webp', label: 'Final — səmaya uçan şarlar', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
