/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ol-1.webp', label: 'Açılış və örtük — şəbəkə pəncərəsi önündə gəlin', hint: 'Açılışda şəkil tağ formalı pəncərədə görünür, toxunanda bütün ekrana açılır. Gizlətsəniz nar qırmızısı fon qalır.' },
  { key: 'nar', src: '/img/wedding/viral/ol-2.webp', label: 'Foto bloku — nar və mis sini (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ol-3.webp', label: 'Proqramın üstündəki şəkil — məclis süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/ol-4.webp', label: 'Final — fənərli həyət', hint: 'Gizlətsəniz yazılar nar qırmızısı fonda qalır.' },
]
