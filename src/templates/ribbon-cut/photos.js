/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/rc-1.webp', label: 'Açılış və örtük — lentli zümrüd qapılar', hint: 'Açılışda qapılar şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/rc-2.webp', label: 'Foto bloku — qayçı və lent (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/rc-3.webp', label: 'Proqramın üstündəki şəkil — açılış masası', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/rc-4.webp', label: 'Final — konfettili açıq qapılar', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
