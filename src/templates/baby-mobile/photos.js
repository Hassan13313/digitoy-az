/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/bm-1.webp', label: 'Açılış və örtük — beşik üstündə mobil', hint: 'Açılışda mobil fiqurları şəklin üstündə yellənir.' },
  { key: 'detail', src: '/img/wedding/viral/bm-2.webp', label: 'Foto bloku — keçə ulduzlar (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/bm-3.webp', label: 'Proqramın üstündəki şəkil — ay və ulduz süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/bm-4.webp', label: 'Final — pəncərədə aypara', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
