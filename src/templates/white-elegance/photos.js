/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/we-1.webp', label: 'Açılış və örtük — ağ qalereyada gəlin', hint: 'Açılışda şəkil paspartuda görünür, toxunanda bütün ekrana açılır.' },
  { key: 'detail', src: '/img/wedding/viral/we-2.webp', label: 'Foto bloku — ağ dəftərxana (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/we-3.webp', label: 'Proqramın üstündəki şəkil — ağ süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/we-4.webp', label: 'Final — ağ pilləkən', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
