/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/cs-1.webp', label: 'Açılış və örtük — axşam sirk çadırı', hint: 'Açılışda çadır pərdələri şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/cs-2.webp', label: 'Foto bloku — nağara və silindr (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/cs-3.webp', label: 'Proqramın üstündəki şəkil — çadırda süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/cs-4.webp', label: 'Final — projektor altında arena', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
