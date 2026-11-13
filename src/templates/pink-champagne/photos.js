/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/pc-1.webp', label: 'Açılış və örtük — buzda çəhrayı şampan və güllər', hint: 'Açılışda köpük şəklin üstündən çəkilir.' },
  { key: 'detail', src: '/img/wedding/viral/pc-2.webp', label: 'Foto bloku — qabarcıqlı şampan badələri (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/pc-3.webp', label: 'Proqramın üstündəki şəkil — çəhrayı desert masası', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/pc-4.webp', label: 'Final — gün batımında terrasda badələr', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
