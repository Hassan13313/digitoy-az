/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/cg-1.webp', label: 'Açılış və örtük — çilçıraq altında gəlin', hint: 'Açılışda şəkil dairəvi pəncərədə görünür. Öz şəklinizi qoysanız kristal parıltısı göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/cg-2.webp', label: 'Foto bloku — kristal şampan qülləsi (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/cg-3.webp', label: 'Proqramın üstündəki şəkil — kristal süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/cg-4.webp', label: 'Final — gümüş konfeti', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
