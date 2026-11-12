/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/md-1.webp', label: 'Açılış və örtük — dəniz kənarında terras', hint: 'Açılışda şəkil çərçivədə görünür, toxunanda bütün ekrana açılır.' },
  { key: 'detail', src: '/img/wedding/viral/md-2.webp', label: 'Foto bloku — limonlar və mayolika (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/md-3.webp', label: 'Proqramın üstündəki şəkil — limon ağacları altında süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/md-4.webp', label: 'Final — limanda axşam', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
