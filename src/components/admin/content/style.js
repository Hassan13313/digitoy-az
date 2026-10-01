/* ─────────────────────────────────────────────────────────────────────────────
   «Məzmun meneceri» — ortaq rəng və sahə stilləri (Phase 45)

   Komponent DEYİL (react-refresh qaydası: komponent faylı yalnız komponent
   ixrac etməlidir), ona görə ui.jsx-dən ayrıdır.
   ───────────────────────────────────────────────────────────────────────── */

export const C = {
  ink:   'oklch(20% 0.02 60)',
  text:  'oklch(28% 0.02 60)',
  sub:   'oklch(52% 0.03 60)',
  faint: 'oklch(62% 0.03 60)',
  line:  'oklch(88% 0.02 60)',
  hair:  'oklch(93% 0.01 75)',
  gold:  'oklch(55% 0.09 80)',
  goldBg:'oklch(97% 0.02 85)',
  warn:  'oklch(58% 0.12 70)',
  danger:'oklch(48% 0.15 25)',
  ok:    'oklch(45% 0.1 150)',
}

/** Mətn sahəsi — telefonda (narrow) barmaq ölçüsündə */
export function inputStyle(narrow) {
  return {
    width: '100%', padding: narrow ? '10px 11px' : '7px 9px', border: `1px solid ${C.line}`, borderRadius: narrow ? 6 : 4,
    fontSize: narrow ? 15 : 12.5, color: C.text, background: 'white', outline: 'none',
    fontFamily: 'inherit', lineHeight: 1.5, minHeight: narrow ? 42 : undefined,
  }
}

export const labelStyle = { fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: C.faint, marginBottom: 4 }

/* Stiker seçimi — builder-in 10 stikeri + tədbir növlərinə uyğun əlavələr.
   İstənilən emoji sahəyə yazıla da bilər (klaviaturadan). */
export const STICKERS = [
  '💍', '💛', '❤️', '🤍', '💕', '💌', '💐', '🌹', '🌸', '🕊️',
  '✨', '⭐', '🌙', '☀️', '👑', '🎉', '🎊', '🥂', '🍾', '🎂',
  '🎁', '🎈', '🎓', '🏢', '💼', '🤝', '🏆', '🎵', '📸', '✈️',
  '🏡', '☕', '🦋', '🌿', '💎', '💒',
]
