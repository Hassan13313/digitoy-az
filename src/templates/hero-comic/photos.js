/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/hc-1.webp', label: 'Açılış və örtük — damda plaşlı qəhrəman', hint: 'Açılışda komiks səhifəsi şəklin üstündən açılır; öz şəklinizi qoysanız da effekt qalır.' },
  { key: 'detail', src: '/img/wedding/viral/hc-2.webp', label: 'Foto bloku — plaş və maska (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/hc-3.webp', label: 'Proqramın üstündəki şəkil — qəhrəman süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/hc-4.webp', label: 'Final — gecə şəhəri və işıq şüası', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
