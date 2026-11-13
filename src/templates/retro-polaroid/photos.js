/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/rt-1.webp', label: 'Açılış və örtük — kamera və ani fotolar', hint: 'Açılışda şəkil polaroid kimi aşkarlanır.' },
  { key: 'detail', src: '/img/wedding/viral/rt-2.webp', label: 'Foto bloku — ipdə polaroidlər (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/rt-3.webp', label: 'Proqramın üstündəki şəkil — retro süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/rt-4.webp', label: 'Final — sahil yolunda köhnə maşın', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
