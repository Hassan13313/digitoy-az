/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/fp-1.webp', label: 'Açılış və örtük — origami turnalar', hint: 'Açılışda kağız qatları şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/fp-2.webp', label: 'Foto bloku — origami ürək və qəhvə (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/fp-3.webp', label: 'Proqramın üstündəki şəkil — kağız süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/fp-4.webp', label: 'Final — fənərlər altında cütlük', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
