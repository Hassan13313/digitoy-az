/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/pn-1.webp', label: 'Açılış və örtük — eyvandan Eyfel qülləsi və papaq qutusu', hint: 'Açılışda papaq qutusu şəklin üstündən açılır.' },
  { key: 'detail', src: '/img/wedding/viral/pn-2.webp', label: 'Foto bloku — makaronlar və papaq qutusu (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/pn-3.webp', label: 'Proqramın üstündəki şəkil — bistro masası', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/pn-4.webp', label: 'Final — gecə parıldayan Eyfel qülləsi', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
