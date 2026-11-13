/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/gj-1.webp', label: 'Açılış və örtük — dəri ailə albomu', hint: 'Açılışda albom qabığı şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/gj-2.webp', label: 'Foto bloku — məktub üstündə üzüklər (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/gj-3.webp', label: 'Proqramın üstündəki şəkil — qızıl süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/gj-4.webp', label: 'Final — gün batımında skamya', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
