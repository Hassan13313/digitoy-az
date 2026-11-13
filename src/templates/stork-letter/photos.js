/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/sl-1.webp', label: 'Açılış və örtük — səhər səmasında leylək', hint: 'Açılışda zərf şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/sl-2.webp', label: 'Foto bloku — möhürlü zərf (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/sl-3.webp', label: 'Proqramın üstündəki şəkil — poçt süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/sl-4.webp', label: 'Final — bacada leylək yuvası', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
