/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/fg-1.webp', label: 'Açılış və örtük — pion tağı altında cütlük', hint: 'Açılış örtüyün özüdür.' },
  { key: 'detail', src: '/img/wedding/viral/fg-2.webp', label: 'Foto bloku — pion buketi (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/fg-3.webp', label: 'Proqramın üstündəki şəkil — bağda süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/fg-4.webp', label: 'Final — ləçək yağışı', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
