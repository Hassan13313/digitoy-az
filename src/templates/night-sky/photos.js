/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ns-1.webp', label: 'Açılış və örtük — Süd Yolu altında cütlük', hint: 'Açılış örtüyün özüdür. Öz şəklinizi qoysanız ulduz parıltıları göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/ns-2.webp', label: 'Foto bloku — teleskop və şampan (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ns-3.webp', label: 'Proqramın üstündəki şəkil — ulduzlar altında süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/ns-4.webp', label: 'Final — təpədə işıqlı çadır', hint: 'Gizlətsəniz yazılar gecə fonunda qalır.' },
]
