/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/gn-1.webp', label: 'Açılış və örtük — art-deko zalı', hint: 'Açılışda art-deko qapı şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/gn-2.webp', label: 'Foto bloku — şampan qülləsi (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/gn-3.webp', label: 'Proqramın üstündəki şəkil — gala süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/gn-4.webp', label: 'Final — qırmızı xalçalı giriş', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
