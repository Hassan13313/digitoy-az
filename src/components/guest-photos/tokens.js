// ════════════════════════════════════════════════════════════════
// Qonaq fotoları — ortaq sabitlər və formatlayıcılar (komponent deyil)
// shared.jsx-dən ayrılıb: layihənin react-refresh lint qaydası komponent
// fayllarında yalnız komponent ixracına icazə verir.
// ════════════════════════════════════════════════════════════════

/** Krem fonda görünən fokus */
export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream';
/** Tünd fonda (lightbox, TV, şəkil üstü) görünən fokus */
export const FOCUS_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black';
/** Şəkil üzərindəki kiçik düymələr üçün (offset-siz, hər fonda görünür) */
export const FOCUS_ON_PHOTO =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60';

/** Tünd şüşə fon (şəkil üzərində, alt panel) */
export const GLASS_DARK =
  'bg-[rgba(24,20,19,0.72)] text-cream ring-1 ring-inset ring-[rgba(232,213,163,0.22)] backdrop-blur-xl backdrop-saturate-150';

/** Bayt → «24,6 MB» */
export function formatBytes(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toLocaleString('az', { maximumFractionDigits: v < 10 && i > 0 ? 1 : 0 })} ${u[i]}`;
}

/** Saniyə → «1:07» */
export function formatDuration(sec) {
  if (sec == null || Number.isNaN(sec)) return '';
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
}

/** 1284 → «1 284» (az) */
/** Rəqəmi minliklərə bölür: 1284 → «1 284» (dar boşluq; brauzerin locale dəstəyindən asılı deyil). */
export const formatNumber = (n) =>
  typeof n === 'number' && Number.isFinite(n)
    ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F')
    : n;

export const DEFAULT_REACTIONS = [
  { emoji: '❤️', label: 'Bəyəndim' },
  { emoji: '😍', label: 'Çox gözəl' },
  { emoji: '👏', label: 'Alqış' },
  { emoji: '🎉', label: 'Təbriklər' },
];

/** Konteyner eninə görə sütun sayı: mobil 2, planşet 3, desktop 4 */
export const defaultColumnsFor = (w) => (w >= 1000 ? 4 : w >= 640 ? 3 : 2);
