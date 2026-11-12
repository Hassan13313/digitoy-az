/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/rg-1.webp', label: 'Açılış və örtük — art-deko zalında cütlük', hint: 'Açılışda şəkil iki tay qapı kimi ortadan açılır.' },
  { key: 'detail', src: '/img/wedding/viral/rg-2.webp', label: 'Foto bloku — qara lak üstündə qızıl (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/rg-3.webp', label: 'Proqramın üstündəki şəkil — qara-qızıl ziyafət', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/rg-4.webp', label: 'Final — qızıl konfeti', hint: 'Gizlətsəniz yazılar qara fonda qalır.' },
]
