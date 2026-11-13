/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/tb-1.webp', label: 'Açılış və örtük — yorğanda ayıcıq', hint: 'Açılışda yorğan şəklin üstündən sürüşüb düşür.' },
  { key: 'detail', src: '/img/wedding/viral/tb-2.webp', label: 'Foto bloku — şərflı ayıcıq (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/tb-3.webp', label: 'Proqramın üstündəki şəkil — ayıcıq süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/tb-4.webp', label: 'Final — axşam pəncərəsində ayıcıq', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
