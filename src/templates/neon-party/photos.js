/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/np-1.webp', label: 'Açılış və örtük — neon işıqlı bar', hint: 'Açılışda neon çərçivə şəklin üstündə yanır.' },
  { key: 'detail', src: '/img/wedding/viral/np-2.webp', label: 'Foto bloku — neon kokteyllər (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/np-3.webp', label: 'Proqramın üstündəki şəkil — neon süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/np-4.webp', label: 'Final — boş rəqs meydançası', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
