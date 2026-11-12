/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/vr-1.webp', label: 'Açılış və örtük — patefonda val', hint: 'Açılışda şəkil dairəvi pəncərədə görünür. Öz şəklinizi qoysanız lampa işığı göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/vr-2.webp', label: 'Foto bloku — mikrofon və badələr (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/vr-3.webp', label: 'Proqramın üstündəki şəkil — caz səhnəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/vr-4.webp', label: 'Final — rəqs meydançası', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
