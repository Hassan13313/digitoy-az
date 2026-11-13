/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/kn-1.webp', label: 'Açılış və örtük — işıqlı konfrans səhnəsi', hint: 'Açılışda ekran effekti şəklin üstündədir.' },
  { key: 'detail', src: '/img/wedding/viral/kn-2.webp', label: 'Foto bloku — səhnə mikrofonu (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/kn-3.webp', label: 'Proqramın üstündəki şəkil — şəbəkə şam yeməyi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/kn-4.webp', label: 'Final — dam terrasından şəhər', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
