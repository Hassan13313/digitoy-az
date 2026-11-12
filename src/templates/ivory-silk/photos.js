/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ivory-1.webp', label: 'Açılış və örtük — məxmər qutuda üzüklər', hint: 'Açılış örtüyün özüdür: bu şəkil həm toxunmadan əvvəl, həm səhifənin üstündə görünür. Gizlətsəniz fil sümüyü fon qalır.' },
  { key: 'gown', src: '/img/wedding/viral/ivory-2.webp', label: 'Foto bloku — gəlinliyin düymələri (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ivory-3.webp', label: 'Proqramın üstündəki şəkil — toy masası', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/ivory-4.webp', label: 'Final — şampan badələri', hint: 'Gizlətsəniz yazılar fil sümüyü fonda qalır.' },
]
