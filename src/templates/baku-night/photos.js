/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/baku-1.webp', label: 'Açılış və örtük — terras və Alov Qüllələri', hint: 'Açılış örtüyün özüdür. Öz şəklinizi qoysanız şəhər işıqlarındakı parıltılar göstərilmir. Gizlətsəniz gecə fonu qalır.' },
  { key: 'city', src: '/img/wedding/viral/baku-2.webp', label: 'Foto bloku — İçərişəhər (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/baku-3.webp', label: 'Proqramın üstündəki şəkil — balo zalı', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'rsvp', src: '/img/wedding/viral/baku-4.webp', label: 'İştirak təsdiqinin üstündəki şəkil — üzüklü əllər', hint: 'Gizlətsəniz forma şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/baku-1.webp', label: 'Final — sonuncu ekran', hint: 'Gizlətsəniz yazılar qara fonda qalır.' },
]
