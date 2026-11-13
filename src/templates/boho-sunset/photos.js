/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/bh-1.webp', label: 'Açılış və örtük — səhrada pampaslı boho tağ', hint: 'Açılışda tağ zolaqları şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/bh-2.webp', label: 'Foto bloku — pampas və rattan (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/bh-3.webp', label: 'Proqramın üstündəki şəkil — səhrada boho süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/bh-4.webp', label: 'Final — qum təpələri üzərində gün batımı', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
