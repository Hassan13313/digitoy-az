/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral).
   `?v=2` — 2026-11-12 fotolar eyni adla yeniləndi; şəkillər 1 il keşlənir (.htaccess),
   sorğu parametri olmasa dünən baxan telefon köhnə fotonu göstərərdi. */
export const PHOTOS = [
  { key: 'opening', src: '/img/wedding/viral/gelin-2.webp?v=2', label: 'Açılış — duvaqlı gəlin', hint: 'Toxunmadan əvvəlki kadr (duvağın bulanıq tülü də bu şəkildən). Gizlətsəniz açılış ağ fonda qalır.' },
  { key: 'hero', src: '/img/wedding/viral/gelin-1.webp?v=2', label: 'Örtük — pəncərə önündə gəlin', hint: 'Açılışın son kadrı və səhifənin üst şəkli (ikisi eyni şəkildir).' },
  { key: 'pair1', src: '/img/wedding/viral/gelin-4.webp?v=2', label: 'Cüt kadr — sol (duvaq)', hint: 'Gizlətsəniz digər kadr tək göstərilir.' },
  { key: 'pair2', src: '/img/wedding/viral/gelin-3.webp?v=2', label: 'Cüt kadr — sağ (buket)', hint: 'Gizlətsəniz digər kadr tək göstərilir.' },
  { key: 'bouquet', src: '/img/wedding/viral/gelin-3.webp?v=2', label: 'Foto bloku — buket (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'finale', src: '/img/wedding/viral/gelin-5.webp?v=2', label: 'Final — ağ güllər', hint: 'Gizlətsəniz yazılar ağ fonda qalır.' },
  { key: 'rsvpDone', src: '/img/wedding/viral/gelin-5.webp?v=2', label: 'İştirak təsdiqindən sonra dairəvi şəkil', hint: 'Qonaq cavab göndərəndən sonra görünür.' },
]
