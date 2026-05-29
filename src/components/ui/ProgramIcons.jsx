/* 25 stroke-only SVG program icons — 24×24 viewBox, currentColor, strokeWidth 1.5 */
const icon = (paths, extra = {}) => ({ paths, ...extra });

export const PROGRAM_ICON_DEFS = [
  {
    id: 'toast',
    label: 'Şampan',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22l4-10 4 10" />
        <path d="M5 8c0-3.3 2.7-6 6-6v0c1.6 0 3 .6 4.1 1.7L17 8" />
        <path d="M7 8h10" />
        <path d="M12 8v4" />
      </svg>
    ),
  },
  {
    id: 'ring',
    label: 'Üzük',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4l1.5 3h3L15 4" />
        <circle cx="12" cy="15" r="6" />
        <path d="M8.5 7 7 9" />
        <path d="M15.5 7 17 9" />
      </svg>
    ),
  },
  {
    id: 'music',
    label: 'Musiqi',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="18" r="2" />
        <circle cx="18" cy="16" r="2" />
        <path d="M10 18V6l10-2v12" />
      </svg>
    ),
  },
  {
    id: 'dance',
    label: 'Rəqs',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="1.5" />
        <path d="M9 8.5c1-.8 4-1 5 0l1.5 3-2 1" />
        <path d="M10 11.5L8 16l2 3" />
        <path d="M14.5 11.5l2 4-1.5 3" />
      </svg>
    ),
  },
  {
    id: 'cake',
    label: 'Tort',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1z" />
        <path d="M20 14v-3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3" />
        <path d="M12 4v6" />
        <path d="M8 6.5c0-1 1-2 2-1l4 2c1 .5 1 2 0 2.5" />
      </svg>
    ),
  },
  {
    id: 'mic',
    label: 'Nitq',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <path d="M12 19v3" />
        <path d="M8 22h8" />
      </svg>
    ),
  },
  {
    id: 'heart',
    label: 'Sevgi',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
  {
    id: 'bowtie',
    label: 'Geyim',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8c0 2.8 4 5 9 4S21 8 21 8s-4 5-9 4S3 8 3 8z" />
        <path d="M3 16c0-2.8 4-5 9-4s9 4 9 4s-4-5-9-4-9 4-9 4z" />
        <path d="M10.5 12h3" />
      </svg>
    ),
  },
  {
    id: 'fireworks',
    label: 'Atəşfəşanlıq',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'coffee',
    label: 'Qəhvə',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
        <path d="M6 2v2M10 2v2M14 2v2" />
      </svg>
    ),
  },
  {
    id: 'photo',
    label: 'Foto',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    id: 'gift',
    label: 'Hədiyyə',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    id: 'balloon',
    label: 'Şar',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="7" />
        <path d="M12 16v2" />
        <path d="M10 18l4 4" />
      </svg>
    ),
  },
  {
    id: 'confetti',
    label: 'Konfetti',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l1.4 4.3L18 5l-3.4 3.1L16 13l-4-2.5L8 13l1.4-4.9L6 5l4.6 1.3L12 2z" />
        <circle cx="5" cy="18" r="1" />
        <circle cx="19" cy="7" r="1" />
        <circle cx="18" cy="19" r="1.5" />
        <circle cx="6" cy="9" r="1" />
      </svg>
    ),
  },
  {
    id: 'dinner',
    label: 'Yemək',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="2" x2="18" y2="22" />
        <path d="M14 2v6a4 4 0 0 0 4 4" />
        <path d="M6 2v4c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" />
        <line x1="8" y1="8" x2="8" y2="22" />
      </svg>
    ),
  },
  {
    id: 'champagne',
    label: 'Şampan kadeh',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2l1.5 6c.5 2 1.5 3 2.5 3s2-1 2.5-3L16 2H8z" />
        <path d="M12 11v8" />
        <path d="M9 19h6" />
      </svg>
    ),
  },
  {
    id: 'bouquet',
    label: 'Gül dəstəsi',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-8" />
        <path d="M9 12c0-3 1.5-5 3-5s3 2 3 5" />
        <path d="M6 14c-1-2.5 0-5 1.5-6 1 3 2.5 5 4.5 6" />
        <path d="M18 14c1-2.5 0-5-1.5-6-1 3-2.5 5-4.5 6" />
        <path d="M9 22h6" />
      </svg>
    ),
  },
  {
    id: 'candle',
    label: 'Şam',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c.3-1 1.7-1 2 0 .5 1.5-1 3-1 3s-1.5-1.5-1-3z" />
        <rect x="9" y="6" width="6" height="14" rx="2" />
        <path d="M6 20h12" />
      </svg>
    ),
  },
  {
    id: 'bell',
    label: 'Zəng',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
  {
    id: 'stars',
    label: 'Ulduzlar',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" />
      </svg>
    ),
  },
  {
    id: 'clap',
    label: 'Alqış',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4l3 10 2-4 2 4 3-10" />
        <path d="M3 14c0 4 3 7 7 7h1c3.9 0 7-3.1 7-7V9" />
        <path d="M17 6V4" />
        <path d="M19 8l1.5-1.5" />
      </svg>
    ),
  },
  {
    id: 'walk',
    label: 'Giriş',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="1.5" />
        <path d="M10 8l-2 7 3-1 2 6" />
        <path d="M14 8l2 7-3-1-2 6" />
        <path d="M8 14l-2 2M16 14l2 2" />
      </svg>
    ),
  },
  {
    id: 'car',
    label: 'Karvan',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9h-3" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'ribbon',
    label: 'Lent',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
        <path d="M6 20l6-12 6 12" />
        <path d="M8.5 15.5h7" />
      </svg>
    ),
  },
  {
    id: 'crown',
    label: 'Tac',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 19l3-11 5 5 2-9 2 9 5-5 3 11H2z" />
        <path d="M2 19h20" />
      </svg>
    ),
  },
];

export default PROGRAM_ICON_DEFS;
