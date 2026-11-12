/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral).
   `?v=3` — 2026-11-12 fotolar eyni adla yeniləndi; şəkillər 1 il keşlənir (.htaccess),
   sorğu parametri olmasa dünən baxan telefon köhnə fotonu göstərərdi. */
export const PHOTOS = [
  { key: 'opening', src: '/img/wedding/viral/sam-1.webp?v=3', label: 'Açılış — şamlar', hint: 'Toxunmadan əvvəlki ilk kadr. Gizlətsəniz açılış qara fonda qalır.' },
  { key: 'hero', src: '/img/wedding/viral/sam-2.webp?v=3', label: 'Örtük — qaranlıqda üzüklər', hint: 'Açılışın son kadrı və səhifənin üst şəkli (ikisi eyni şəkildir).' },
  { key: 'invite', src: '/img/wedding/viral/sam-4.webp?v=3', label: 'Dəvət mətninin altında — şamlı masa', hint: 'Gizlətsəniz yalnız şəkil yığışır, mətn qalır.' },
  { key: 'rings', src: '/img/wedding/viral/sam-3.webp?v=3', label: 'Foto bloku — üzüklər (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'stairs', src: '/img/wedding/viral/sam-5.webp?v=3', label: 'Foto bloku — şamlı pilləkən', hint: 'Gizlətsəniz blok yığışır.' },
  { key: 'finale', src: '/img/wedding/viral/sam-1.webp?v=3', label: 'Final — sonuncu ekran', hint: 'Gizlətsəniz yazılar qara fonda qalır.' },
]
