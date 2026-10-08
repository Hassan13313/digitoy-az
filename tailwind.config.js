/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* Rənglər iç-içə yazılıb, amma köhnə siniflər eynidir:
         `gold.dark` → `text-gold-dark`, `beige.dark` → `bg-beige-dark` və s.
         UI redesign (2026-10) əlavələri: gold.deep/rich/mist, espresso.soft,
         sand, rust, olive — açıq fonda AA kontrastlı tonlar. */
      colors: {
        cream: '#FDFBF7',
        beige: { DEFAULT: '#F4F1EA', dark: '#DDD5C8' },
        gold: {
          DEFAULT: '#C5A059',
          dark: '#B8903A',
          light: '#E8D5A3',
          deep: '#84652A',  /* krem fonda 5.2:1 — kiçik mətn, eyebrow, link */
          rich: '#A9822F',  /* krem fonda 3.4:1 — yalnız böyük başlıq (≥24px) */
          mist: '#F3EAD3',  /* çox açıq qızılı fon (chip, hover) */
        },
        brown: { muted: '#8C7B6B', dark: '#5C4A3A' },
        ink: '#1A1A1A',
        espresso: { DEFAULT: '#2C2523', soft: '#3A312D' },
        sand: '#CBBFAE',                              /* espresso fonda ikinci mətn */
        rust: { DEFAULT: '#9A3B2E', mist: '#F7E9E4' },  /* xəta */
        olive: { DEFAULT: '#4F6B3A', mist: '#ECF1E4' }, /* uğur */
        'birthday-accent': '#DB2777',
        'birthday-light': '#FCE7F3',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      /* ⚠ Köhnə komponentlər bu radiusları işlədir. Redesign komponentləri
         Tailwind-in standart radiusları ilə dizayn olunub — onlarda
         `rounded-[12px]` kimi dəqiq dəyərlər yazılıb (bax src/components/*). */
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      zIndex: {
        nav: '100',
        overlay: '200',
        toast: '500',
      },
      transitionDuration: {
        fast: '200ms',
        base: '350ms',
        slow: '600ms',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      letterSpacing: {
        eyebrow: '0.28em',
        label: '0.16em',
      },
      boxShadow: {
        hairline: '0 0 0 1px rgba(197,160,89,0.18)',
        soft: '0 1px 2px rgba(44,37,35,0.04), 0 8px 24px -12px rgba(44,37,35,0.10)',
        lift: '0 1px 2px rgba(44,37,35,0.05), 0 18px 40px -18px rgba(92,74,58,0.28)',
        luxe: '0 2px 4px rgba(44,37,35,0.04), 0 30px 60px -30px rgba(92,74,58,0.35), 0 0 0 1px rgba(197,160,89,0.14)',
        'inner-gold': 'inset 0 1px 0 rgba(232,213,163,0.35)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(110deg, #8A6A2B 0%, #A9822F 35%, #B08A3A 50%, #A9822F 65%, #8A6A2B 100%)',
        'gold-line': 'linear-gradient(90deg, transparent, #C5A059 50%, transparent)',
        'espresso-grad': 'linear-gradient(160deg, #3A312D 0%, #2C2523 60%, #241E1C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'shimmer-border': 'shimmerBorder 3s linear infinite',
        sheen: 'sheen 4.5s cubic-bezier(0.22,1,0.36,1) 1.1s 1 both',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        eq: 'eq 1.1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmerBorder: {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        sheen: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        eq: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
}
