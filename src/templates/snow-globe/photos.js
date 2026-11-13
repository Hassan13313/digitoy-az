/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/sg-1.webp', label: 'Açılış və örtük — pəncərə önündə qar kürəsi', hint: 'Açılışda foto qar kürəsinin içindən görünür.' },
  { key: 'detail', src: '/img/wedding/viral/sg-2.webp', label: 'Foto bloku — yolka oyuncaqları (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/sg-3.webp', label: 'Proqramın üstündəki şəkil — qış süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/sg-4.webp', label: 'Final — qarlı kənd gecəsi', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
