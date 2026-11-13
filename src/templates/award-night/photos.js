/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/an-1.webp', label: 'Açılış və örtük — projektor altında kubok', hint: 'Açılışda projektor şəklin üstündə gəzir.' },
  { key: 'detail', src: '/img/wedding/viral/an-2.webp', label: 'Foto bloku — medallar və dəfnə (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/an-3.webp', label: 'Proqramın üstündəki şəkil — mükafat şam yeməyi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/an-4.webp', label: 'Final — qırmızı xalça və flaşlar', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
