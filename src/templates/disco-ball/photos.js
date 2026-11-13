/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/db-1.webp', label: 'Açılış və örtük — güzgü disko kürəsi', hint: 'Açılışda kürə şəklin üstündə fırlanır.' },
  { key: 'detail', src: '/img/wedding/viral/db-2.webp', label: 'Foto bloku — parıltılı kokteyllər (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/db-3.webp', label: 'Proqramın üstündəki şəkil — işıqlı rəqs meydançası', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/db-4.webp', label: 'Final — konfetti və işıqlar', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
