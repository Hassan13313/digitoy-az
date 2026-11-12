/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/sd-1.webp', label: 'Açılış və örtük — qarlı dağ evi', hint: 'Açılış örtüyün özüdür. Öz şəklinizi qoysanız pəncərələrdəki isti işıq göstərilmir (qar yağmağa davam edir). Gizlətsəniz gecə fonu qalır.' },
  { key: 'bouquet', src: '/img/wedding/viral/sd-3.webp', label: 'Foto bloku — qış buketi (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/sd-2.webp', label: 'Proqramın üstündəki şəkil — şamlı şam yeməyi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/sd-4.webp', label: 'Final — fənərli cığır', hint: 'Gizlətsəniz yazılar gecə fonunda qalır.' },
]
