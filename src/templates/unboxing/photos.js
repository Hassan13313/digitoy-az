/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ub-1.webp', label: 'Açılış və örtük — projektor altında qutu', hint: 'Açılışda qutu şəklin üstündə açılır.' },
  { key: 'detail', src: '/img/wedding/viral/ub-2.webp', label: 'Foto bloku — işıq saçan açıq qutu (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ub-3.webp', label: 'Proqramın üstündəki şəkil — təqdimat masası', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/ub-4.webp', label: 'Final — işıq şüalı səhnə', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
