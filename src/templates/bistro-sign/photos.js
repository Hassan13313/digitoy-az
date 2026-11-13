/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/bs-1.webp', label: 'Açılış və örtük — axşam bistro fasadı', hint: 'Açılışda tente və lövhə şəklin üstündədir.' },
  { key: 'detail', src: '/img/wedding/viral/bs-2.webp', label: 'Foto bloku — espresso və kruasan (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/bs-3.webp', label: 'Proqramın üstündəki şəkil — işıqlar altında masalar', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/bs-4.webp', label: 'Final — gecə bistrosu', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
