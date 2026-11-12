/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'opening', src: '/img/wedding/viral/sam-1.webp', label: 'Açılış — şamlar', hint: 'Toxunmadan əvvəlki ilk kadr. Gizlətsəniz açılış qara fonda qalır.' },
  { key: 'hero', src: '/img/wedding/viral/sam-2.webp', label: 'Örtük — qaranlıqda üzüklər', hint: 'Açılışın son kadrı və səhifənin üst şəkli (ikisi eyni şəkildir).' },
  { key: 'invite', src: '/img/wedding/viral/sam-4.webp', label: 'Dəvət mətninin altında — şamlı masa', hint: 'Gizlətsəniz yalnız şəkil yığışır, mətn qalır.' },
  { key: 'rings', src: '/img/wedding/viral/sam-3.webp', label: 'Foto bloku — üzüklər (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'stairs', src: '/img/wedding/viral/sam-5.webp', label: 'Foto bloku — şamlı pilləkən', hint: 'Gizlətsəniz blok yığışır.' },
  { key: 'finale', src: '/img/wedding/viral/sam-1.webp', label: 'Final — sonuncu ekran', hint: 'Gizlətsəniz yazılar qara fonda qalır.' },
]
