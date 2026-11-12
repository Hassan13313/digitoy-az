/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/nt-1.webp', label: 'Açılış və örtük — dağ çəmənliyində cütlük', hint: 'Açılışda şəkil tağ formalı pəncərədə görünür, toxunanda bütün ekrana açılır.' },
  { key: 'detail', src: '/img/wedding/viral/nt-2.webp', label: 'Foto bloku — herbari və ağac kəsiyi (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/nt-3.webp', label: 'Proqramın üstündəki şəkil — çəmənlikdə süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/nt-4.webp', label: 'Final — dumanlı dağlar', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
