/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ft-1.webp', label: 'Açılış və örtük — kitabdan qalxan qəsr', hint: 'Açılışda kitab qapaqları şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/ft-2.webp', label: 'Foto bloku — güzgü, tac və kitablar (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ft-3.webp', label: 'Proqramın üstündəki şəkil — nağıl süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/ft-4.webp', label: 'Final — alaqaranlıqda qəsr', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
