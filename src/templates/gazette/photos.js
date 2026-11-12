/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/gz-1.webp', label: 'Açılış və örtük — kafe masasında qəzetlər', hint: 'Açılışda şəkil çərçivədə görünür, toxunanda bütün ekrana açılır.' },
  { key: 'detail', src: '/img/wedding/viral/gz-2.webp', label: 'Foto bloku — yazı makinası (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/gz-3.webp', label: 'Proqramın üstündəki şəkil — mətbəədə süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/gz-4.webp', label: 'Final — gecə köşkü', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
